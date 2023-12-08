---
title: Getting Started
weight: 2
---

### Preparing input data

The first step, to perform simulations with `Green`/`WeakCoupling`, is the preparation of input data.
Currently to prepare input data we use interface with \textnormal{\texttt{PySCF}}.
To generate input data user has to call `python/init_data_df.py` script located in the source directory.
The following parameters are mandatory:

  - `--a`  path to a file containing crystal geometry in xyz format
  - `--atom`  path to a file containing unit cell description
  - `--nk`  number of reciprocal space points in each direction
  - `--basis`  Gaussian basis set, it can be specified as a single basis for every atom in the unit cell or for each atom individually

By default it will generate `input.h5` file, that contains parameters and initial mean-field solution of the system, `df_int` and `df_hf_int` directories
contain Coloumb integrals of the system.

### Solving self-consistent approximation

To perform weak-coupling simulations, one have to call `mbpt.exe` executable located at the installation path in the `bin` subdirectory.
Minimal parameters that are needed to run weak-coupling simulations are following:

  - `--BETA`  inverse temperature
  - `--scf_type` type of self-consistent approximation, should be either `GW`, `GF2` or `HF`
  - `--grid_file`  path to a file containing non-uniform grids, program will check three possible locations:
    - current directory or absolute path
    - `<installation directory>/share`
    - build directory of weak-coupling code

Currently, we provide IR (`ir` subdirectory) and Chebyshev grids (`cheb` subdirectory) for nonuniform imaginary time representation.
For more details on nonuniform grids, please follow this [link](/tutorials/matsubara-and-imaginary-time)


After succesful completetion results will be written to a file located at `--results_file` (by default set to `sim.h5`)
To get information about other parameters and their default values call `mbpt.exe --help`.

### Tutorial on running Silicon

Here we provide a simple example on how to run `Green`/`Weakcoupling` on the example of a periodic silicon on `2x2x2` lattice.
We use the `a.dat` file containing the following unit cell information
```
0.0,  2.7155, 2.7155
2.7155, 0.0,  2.7155
2.7155, 2.7155, 0.0
```

Lattice vectors located in `atom.dat` file
```
Si 0.0  0.0  0.0
Si 1.35775 1.35775 1.35775
```

First, we need to obtain parameters and initial mean-field solution
```
python <source root>/green-mbpt/python/init_data_df.py --a a.dat --atom atom.dat --nk 2 --basis gth-dzvp-molopt-sr --pseudo gth-pbe --xc PBE 
```
We use `gth-dzvp-molopt-sr` basis and `gth-pbe` psudopotential and run `DFT` mean-field approximation  with `PBE` exchange correlation potential
to reproduce results from [Phys. Rev. B 106, 235104].

After that we will run `GW` approximation
```
<install dir>/bin/mbpt.exe --scf_type=GW --BETA 100 --grid_file ir/1e4.h5 --itermax 10 --results_file Si.h5
```
Here we run `GW` approximation at inverse temperature $ \beta=100 $, we  use `IR` nonuniform grid for $ \Lambda = 10^4 $ and run for 10 iterations
and store results into `Si.h5` file.
