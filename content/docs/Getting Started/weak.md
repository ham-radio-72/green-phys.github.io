---
title: Running weak-coupling simulations
linkTitle: GF2/GW
weight: 2
---

### Preparing input data

The first step of any simulations with `Green`/`WeakCoupling` is the preparation of the input data, which includes the calculation of the Coulomb and one-body integrals as well as a starting density matrix out of geometry, atom, k-point, and basis information.
Currently  we use an interface with [PySCF](https://pyscf.org/) to prepare input data.
To generate input data a user has to call the `python/init_data_df.py` script located in the source directory (for a simple example see below).
The following parameters are mandatory:

  - `--a`  path to a file containing crystal geometry in xyz format
  - `--atom`  path to a file containing unit cell description
  - `--nk`  number of reciprocal space points in each direction
  - `--basis`  Gaussian basis set, it can be specified as a single basis for every atom in the unit cell or for each atom individually

By default the script will  `init_data_df.py` will generate the file `input.h5`. This file contains all necessary parameters and an initial mean-field solution of the system. In addition, the script will generate the `df_int` and `df_hf_int` directories
which contain the Coloumb and one-body integrals of the system.

After the simulation is performed, results (such as band structures) could be displayed along a high-symmetry path. To obtain a specific high-symmetry path, 
specify the high-symmetry points on the path and the total number of points along the path by providing the two parameters `--high_symmetry_path` and `--high_symmetry_path_points`.
To see all available high-symmetry points for a chosen system, use theoption `--print_high_symmetry_points`.
The interplation along high-symmetry paths will perform a basic Wannier interpolation.

If your python installation does not have pyscf available (type `python` and, in the python prompt, `import pyscf`), you will need to follow the instructions at [PySCF](https://pyscf.org/) or execute `pip install pyscf`. Similarly, since `init_data_df.py` depends on the (numba)[https://numba.pydata.org/] module, you may need to install it as `pip install numba`.


### Solving the self-consistent approximation

To perform weak-coupling simulations, one have to call `mbpt.exe` executable located at the installation path in the `bin` subdirectory.
Minimal parameters that are needed to run weak-coupling simulations are following:

  - `--BETA`  inverse temperature
  - `--scf_type` type of self-consistent approximation, should be either `GW`, `GF2` or `HF`
  - `--grid_file`  path to a file containing non-uniform grids, program will check three possible locations:
    - current directory or absolute path
    - `<installation directory>/share`
    - build directory of weak-coupling code

Currently, we provide IR (`ir` subdirectory) and Chebyshev grids (`cheb` subdirectory) for nonuniform imaginary time representation.
For more details on nonuniform grids, please follow this [link](/docs/tutorials/matsubara-and-imaginary-time)


After succesful completetion results will be written to a file located at `--results_file` (by default set to `sim.h5`)
To get information about other parameters and their default values call `mbpt.exe --help`. 

### Band-path interpolation

If input data contains information about high-symmetry path,
diagonal part of the Green's function can be evaluated on provided high-symmetry path, and results will be stored in the `G_tau_hs` group in `--high_symmetry_output_file` 
(by default set to `output_hs.h5`).
For that the option `--jobs WINTER`

### Postprocessing

The `Green`/`Weakcoupling` code provides several post-processing procedures such as analytical continuation packages to obtain spectral representations and
thermodynamic utilities to obtain thermodynamic quantities.

#### Spectral representation

To obtain the spectral representation of a Green's function, the `Green` software stack provides an analytical continuation package.

```ShellSession
  $ git clone https://github.com/Green-Phys/green-ac.git
  $ mkdir build
  $ cd build
  $ cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=/path/to/install/directory ../green-ac
  $ make -j 4 && make test && make install
```

This will install the `Green`/`Continuation` package into `/path/to/install/directory`.

To run the analytical continuation one have to execute the program `ac.exe` located at the installation path in the `bin` subdirectory.
The following parameters are required:
  - `--grid_file`  Sparse imaginary time/frequency grid file name
  - `--BETA`  Inverse temperature
  - `--input_file`  Name of the input file
  - `--output_file`  Name of the output file
  - `--group`  Name of the HDF5 group in the input file, that contains imaginary time data, it has to contain `mesh` and `data` datasets.
  - `--kind`  Type of analytical continuation, currently only `NEVANLINNA` is implemented.

The command `ac.exe --help` will provide additional information.


