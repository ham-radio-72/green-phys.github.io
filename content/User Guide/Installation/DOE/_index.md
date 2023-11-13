---
title: Installation on DOE machines
weight: 2
---

### Weak-coupling Many-Body Perturbation theory solver

### 0. Please make sure to have the following third-party software installed and available:

  * Third-Party Dependencies
    - Eigen3 >= 3.4.0
    - MPI
    - HDF5 >= 1.10.0
    - BLAS
    - CMake >= 3.18

### 1. Download and build Many-Body Perturbation theory solver

  ```ShellSession
  $ git clone https://github.com/Green-Phys/green-mbpt
  $ mkdir build
  $ cd build
  $ cmake -DCMAKE_BUILD_TYPE=Release ../green-mbpt
  $ make -j 4 && make test
  ```

***