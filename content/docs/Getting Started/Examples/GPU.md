---
title: Running on a GPU
linkTitle: Running on a GPU
weight: 1
icon: silicon
---


After preparing the integrals as described in the Silicon example, change the command for running the GW code from

```
<install dir>/bin/mbpt.exe --scf_type=GW --BETA 100       \
  --grid_file ir/1e4.h5 --itermax 10 --results_file Si.h5 \
  --high_symmetry_output_file Si_hs.h5 --jobs SC,WINTER
```

to use the GPU kernel. For this, specify 
```
  --kernel=GPU
```
since the default kernel is a CPU kernel. If you are running this on a consumer GPU, floating point operations are often much faster in single precision than in double precision.
You can therefore additionally force the code to run in single precision:
```
  --kernel=GPU --Sigma_sp=true --P_sp=true
```
such that both the calculation of the self-energy and of the polarization are performed in single precision. Note that on consumer cards such as Nvidia's Ampere generation, single precision 
is 64x faster than double precision.

The total command should be:
```
<install dir>/bin/mbpt.exe --scf_type=GW --BETA 100       \
  --grid_file ir/1e4.h5 --itermax 10 --results_file Si.h5 \
  --high_symmetry_output_file Si_hs.h5 --jobs SC,WINTER   \
  --kernel=GPU --Sigma_sp=true --P_sp=true
```
