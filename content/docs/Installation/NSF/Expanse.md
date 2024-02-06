---
title: SDSC Expanse
weight: 1
---

### Installation on SDSC Expanse

  1. Load necessary modules
```ShellSession
 $ module load gcc 
 $ module load cmake/3.21.4 mvapich2/2.3.7 hdf5/1.10.7 eigen/3.4.0 openblas/dynamic/0.3.7
```
   - Notice that we use mvapich2 as an MPI implementation
   - We strongly advice you to use openblas/dynamic/0.3.7 module for BLAS implementation. Other BLAS modules cause errors when combined with Eigen.
  2. Download Green Many-Body framework and create build directory
```ShellSession
 $ git clone https://github.com/Green-Phys/green-mbpt
 $ cd green-mbpt
 $ mkdir build
 $ cd build
```
  3. Build code
```ShellSession
 $ CC=mpicc CXX=mpicxx cmake .. -DCMAKE_BUILD_TYPE=Release
 $ make -j 8 && make test
```
   - Make sure to specify `CC=mpicc` and `CXX=mpicxx`, HDF5 library headers include `<mpi.h>` if MPI module is loaded even if your code does not use MPI.
