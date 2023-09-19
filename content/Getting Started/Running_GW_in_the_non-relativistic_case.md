---
title: Running GW in the non-relativistic case
permalink: /Getting_Started_–_Running_GW_in_the_non-relativistic_case/
weight: 16
---

Chia-Nan's talk on running GW in the non-relativistic case:

{{<youtube id="krpJrQlJl1Q" >}}

Slides are available
[here](https://green.physics.lsa.umich.edu/mw19/images/d/df/ScGW_in_practice.pdf).

## Prerequisites

Before you start a GW simulation, we assume that you have run a density
functional or a Hartree Fock calculation with pySCF. We also assume that
you have obtain and stored density-fitted integrals in the right
geometry.

The script init_data_df.py will run pySCF to obtain these quantities.
For Silicon, it would typically be invoked as

`python -O init_data_df.py --a ../input/a.dat --atom ../input/atoms.dat --nk 6 --Nk 6 --basis gthdzvpmoloptsr --pseudo gthpbe --auxbasis def2-svp --xc pbe --sigma 0.5`

## GW Parameter file

Parameters are passed into the GW code in two ways: in the parameter
file, and as command-line parameters. The options are interchangeable,
and

`UGF2 --help`

will give you a complete overview of all allowed parameters. Here is an
example of a sample GW parameter file:
```
nel_cell=8
nao=26
nk=216
ink=112
ns=2
mu=0
NQ=36
itermax=30
scf_type=GW
CONST_DENSITY=true
E_thr=1e-5
damp=0.3
max_trust_rad=100000
new_DIIS=true
com_DIIS=true
DIIS_size=5
DIIS_start=3
rst=true
mulliken=true
```

...and here is an example of a sample invocation on the command line:

```
srun -v $BinDir/UGF2  ${param_file} --TNL=${tempdir}/1e7_202.h5 \
                                           --TNL_B=${tempdir}/1e7_202.h5 \
                                           --ni=202 \
                                           --nt_batch=204 \
                                           --IR=true \
                                           --input_file=${input_file} \
                                           --dfintegral_file=${tempdir}/df_int \
                                           --HF_dfintegral_file=${tempdir}/df_hf_int \
                                           --Results sim.h5 \
                                           --scf_type cuGW \
                                           --ntauspinprocs=1 \
                                           --programs=SC \
                                           --beta 100 \
                                           --cuda_low_cpu_memory=false \
                                           --cuda_low_gpu_memory=false \
                                           --single_prec=1
```

Note that you can shuffle commands arbitrarily from the command line to
the parameter file and back.

## Running GW on a CUDA machine

The GW code runs both on GPU clusters and on CPU clusters, in single-
and in multiprecision. Parallelization is highly customizable. You will
need to verify that the results are accurate and obtained efficiently.

The following are a few elementary pointers:

1.  You need to compile the code with CUDA. This requires the CMAKE flag
    --WITH_CUDA=ON.
2.  Parallelization goes over the number of q-points. Make sure that the
    number of q-points can be divided by the number of GPUs, and the
    number of q-points is either equal to the number of GPUs or
    substantially larger.
3.  Parallelization is efficient if many operations can be performed in
    parallel. Because the code uses strided batched multiplications over
    tau-points, it becomes efficient if there are many of those that can
    be done in parallel. Thus, nt_batch as large as ni is advantageous,
    if possible with memory.
4.  GPU parallelization is efficient if latency can be hidden. This
    happens if many k-points for each q-point can be scheduled in
    parallel. It is therefore advantageous to have at least four
    parallel qk-points at once. Reduce nt_batch until that is possible.
5.  There are high-memory and low-memory modes. Whenver possible, use
    high-memory modes both on the GPU and on the CPU. The low-memory
    modes are less efficient (use more read access) but may allow you to
    do larger problems.

## A sample CUDA submission script

The following is a sample submission script (here from greatlakes) that
submits a GPU job to run in single precision.

First part: SLURM header. Make sure you get to the right partition,
allocate the right memory size, use the correct number of cores, etc.

```
#!/bin/bash
#SBATCH --account=egull0
#SBATCH --job-name=Si_GPU
#SBATCH --partition=gpu
#SBATCH --gpus=2
#SBATCH --time=06:00:00
#SBATCH --nodes=1
#SBATCH --tasks-per-node=40
#SBATCH --output=Si_GPU_GW.o%j
#SBATCH --error=Si_GPU_GW.e%j
#SBATCH --mem=180g
#SBATCH --exclusive
```

Second part: Load the modules and set the environment variables. Setting
OMP_NUM_THREAD=1 unless you use OpenMP is always a good idea in case a
library, such as BLAS or LAPACK, uses OpenMP.

```
module load cuda
#OpenMP settings:
export OMP_NUM_THREADS=1
export HDF5_USE_FILE_LOCKING=FALSE

Third part: set environment variables for the location of your input
files, output files, and IR coefficients.

BinDir=/home/egull/Projects/UGF2/build
integral_dir=/nfs/turbo/lsa-egull/egull/Si_GPU/pySCF_666
ir_coeff_dir=/nfs/turbo/lsa-egull/egull/ir_coeffs
run_dir=/nfs/turbo/lsa-egull/egull/Si_GPU/cuGW_singleprec/

param_file=${run_dir}/gw_param
input_file=${integral_dir}/input.h5
```

Fourth part: start setting up the environment. Call nvidia-smi to see
what GPUs are available.

```
date
nvidia-smi

if [ $# -lt 2 ]; then
  echo "please specify beta and sc type..."
  exit -1
fi

cd ${run_dir}
```

5th part: cache data on a local fast nvme drive, if such a drive is
available. Adjust the location and the pattern. The 'trap' command
ensures that the files are deleted once you're done.

```
#create scratch dir for fast access
scratch_base=/scratch/egull_root/egull0/egull/
template=Si_GPU_XXXXXX
tempdir=$(mktemp -d $scratch_base/$template)

date
echo "prestage to" $tempdir
cp ${ir_coeff_dir}/1e7_202.h5 $tempdir
cp -r ${integral_dir}/df_int $tempdir
cp -r ${integral_dir}/df_hf_int $tempdir
ls -lh $tempdir
du -h $tempdir
echo "done with prestage to" $tempdir
trap 'rm -rf -- "$tempdir"' EXIT
date
```

6th part: run the GW code until convergence!

```
#running the job
srun -v $BinDir/UGF2  ${param_file} --TNL=${tempdir}/1e7_202.h5 \
                                           --TNL_B=${tempdir}/1e7_202.h5 \
                                           --ni=202 \
                                           --nt_batch=204 \
                                           --IR=true \
                                           --input_file=${input_file} \
                                           --dfintegral_file=${tempdir}/df_int \
                                           --HF_dfintegral_file=${tempdir}/df_hf_int \
                                           --Results sim.h5 \
                                           --scf_type ${2} \
                                           --ntauspinprocs=1 \
                                           --programs=SC \
                                           --beta ${1} \
                                           --cuda_low_cpu_memory=false \
                                           --cuda_low_gpu_memory=false \
                                           --single_prec=1
date
```