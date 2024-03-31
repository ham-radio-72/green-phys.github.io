---
title: Installation instructions
linkTitle: From sources
weight: 1
---

{{< tabs items="Weak-Coupling Code, Continuation" >}}

{{< tab >}}
### Weak-coupling Many-Body Perturbation theory solver

{{% steps %}}

### Prerequisites: HPC libraries and tools
Please make sure to have the following third-party software installed and available:

  * Third-Party Dependencies
    - Eigen3 >= 3.4.0
    - MPI
    - HDF5 >= 1.10.0
    - BLAS
    - CMake >= 3.18
    - CUDAToolkit > 12.0 (optional)

  These packages are external to Green. Their installation will depend on your computer. Eigen3 is a C++ matrix library, you can find more information [here](https://eigen.tuxfamily.org/). MPI is the Message Passing Interface, several standard implementations exist, including [OpenMPI](https://www.open-mpi.org/) and [MPICH](https://www.mpich.org/). High performance computers will have proprietary MPI installations, and most clusters provide a version for all users. [HDF5](https://www.hdfgroup.org/solutions/hdf5/) is a library for binary data storage. More information on  BLAS, the Basic Linear Algebra System, can be found on [netlib.org](netlib.org). However, most computers provide highly optimized versions tuned for their respective hardware. Do NOT install the reference BLAS from netlib but instead have a look at a generic high-performance implementation from [OpenBLAS](https://www.openblas.net/) and the hardware-specific vendor libraries (among many others: [Apple](https://developer.apple.com/documentation/accelerate/blas/), [Intel MKL/OneAPI](https://www.intel.com/content/www/us/en/developer/tools/oneapi/onemkl.html), [AMD AOCL](https://www.amd.com/en/developer/aocl.html), [IBM ESSL](https://www.ibm.com/docs/en/essl/6.2?topic=whats-new)).
    [Cmake](https://cmake.org/) is a build system that will find the locations of the above packages and generate compilation instructions in Makefiles. [CUDA](https://developer.nvidia.com/cuda-toolkit) is an Nvidia GPU development environment.

### Prerequisites: Python Libraries
Please make sure to have python and the following python packages available:

   * Third-Party Dependencies
     - pySCF
     - numba
     - spglib
     - ase
   
  These are third-party packages that you can install using your favorite python package manager, such as pip:
  ```ShellSession
  $ pip install pyscf numba spglib ase
  ```

   The preferred python version is 3 (any minor version should work). Note that some installations use pip3 instead of pip, for help on python package installation see https://pypi.org/project/pip/ .

### Download and Build: CPU version
The following instructions will download and build the CPU-only version of the Many-Body Perturbation theory solver (replace /path/to/install/directory with the directory where you'd like to install the code):

  ```ShellSession
  $ git clone https://github.com/Green-Phys/green-mbpt
  $ mkdir green-mbpt-build
  $ cd green-mbpt-build
  $ cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=/path/to/install/directory ../green-mbpt
  $ make -j 4 && make test
  ```

If you have a non-standard installation location of the dependent packages installed in step 1, cmake will fail to find the package. Green uses the standard cmake mechanism (FindXXX.cmake) to find packages. The following pointers may help:
  - For Eigen: specify in the cmake line: -DEigen3_DIR=/header/directory/of/eigen
  - For MPI: Follow the instructions on [cmake with mpi](https://cmake.org/cmake/help/latest/module/FindMPI.html)
  - For BLAS: Follow the instructions on [cmake with BLAS](https://cmake.org/cmake/help/latest/module/FindBLAS.html)
  - For HDF5: Follow the instructions on [cmake with HDF5](https://cmake.org/cmake/help/latest/module/FindHDF5.html)

***

After successfully building the code, you will need to install it. The install location is either specified with -DCMAKE_INSTALL_PREFIX=/path/to/install/directory as a cmake command during configuration or can be edited in CMakeCache.txt after compilation (see [cmake manual](https://cmake.org/cmake/help/latest/variable/CMAKE_INSTALL_PREFIX.html)).

  ```ShellSession
  $ cmake install
  ```
Your install directory will be created; if everything was successful you can find the executable mbpt.exe under the bin directory of your installation path.

### Download and Build: Nvidia GPU kernels

GPU kernels for the many-body perturbation framework use extensions from a custom repository. You enable the GPU kernels by setting following CMake parameters:
   - `GREEN_KERNEL_URL="https://github.com/Green-Phys/green-gpu"`
   - `GREEN_CUSTOM_KERNEL_LIB="GREEN::GPU"`
   - `GREEN_CUSTOM_KERNEL_ENUM=GPU `
   - `GREEN_CUSTOM_KERNEL_HEADER="<green/gpu/gpu_factory.h>"`

The following instructions will download and build the Many-Body Perturbation theory solver with additional GPU kernels (replace /path/to/install/directory with the directory where you'd like to install the code):

  ```ShellSession
  $ git clone https://github.com/Green-Phys/green-mbpt
  $ mkdir green-mbpt-build
  $ cd green-mbpt-build
  $ cmake -DCMAKE_BUILD_TYPE=Release                                \
     -DCUSTOM_KERNEL=GPU_KERNEL                                     \
     -DGREEN_KERNEL_URL="https://github.com/Green-Phys/green-gpu"   \
     -DGREEN_CUSTOM_KERNEL_LIB="GREEN::GPU"                         \
     -DGREEN_CUSTOM_KERNEL_ENUM=GPU                                 \
     -DGREEN_CUSTOM_KERNEL_HEADER=<green/gpu/gpu_factory.h>         \
     -DCMAKE_INSTALL_PREFIX=/path/to/install/directory ../green-mbpt
  $ make -j 4 && make test
  ```

{{% /steps %}}

### Download and Build: National HPC Resources
The code has been successfully built and tested on National HPC resources. Instructions for the compilation on these machines are provided below:
  - [NSF (ACCESS) Machines](/user-guide/installation/nsf/)
    - [SDSC Expanse](/user-guide/installation/nsf/expanse/)
  - [DOE Machines](/user-guide/installation/doe/)
    - NERSC Perlmutter
  If you would like to have the code tested on additional machines please let us know by filing an [issue](https://github.com/Green-Phys/green-mbpt/issues).

### Installation issues
   If you encounter issues with compiling, installing, or testing the package please file an issue on our github issues page, [https://github.com/Green-Phys/green-mbpt/issues](https://github.com/Green-Phys/green-mbpt/issues), and we will do our best to help.


{{< /tab >}}
{{< tab >}}

### Analytical continuation package

{{% steps %}}

### Prerequisites: HPC libraries and tools
Please make sure to have the following third-party software installed and available:

  * Third-Party Dependencies
    - Eigen3 >= 3.4.0
    - MPI
    - HDF5 >= 1.10.0
    - BLAS
    - CMake >= 3.18
    - GMP

These packages are the same as the ones required for the mbpt code, except for GMP. [GMP](https://gmplib.org/) is a multiple-precision floating-point library. If it is installed but your compiler does not find it automatically, try setting the environment variable GMP_DIR to specify the directory where cmake should look for gmp.h and the gmp libraries.

### Download and Build
The following instructions will download and build the Analytical Continuation package (replace /path/to/install/directory with the directory where you'd like to install the code):

```ShellSession
  $ git clone https://github.com/Green-Phys/green-ac.git
  $ mkdir build
  $ cd build
  $ cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=/path/to/install/directory ../green-ac
  $ make -j 4 && make test && make install
```

If you have a non-standard installation location of the dependent packages installed in step 1, cmake will fail to find the package. Green uses the standard cmake mechanism (FindXXX.cmake) to find packages. The following pointers may help:
  - For Eigen: specify in the cmake line: -DEigen3_DIR=/header/directory/of/eigen
  - For MPI: Follow the instructions on [cmake with mpi](https://cmake.org/cmake/help/latest/module/FindMPI.html)
  - For BLAS: Follow the instructions on [cmake with BLAS](https://cmake.org/cmake/help/latest/module/FindBLAS.html)
  - For HDF5: Follow the instructions on [cmake with HDF5](https://cmake.org/cmake/help/latest/module/FindHDF5.html)
  - For GMP: specify in the environment variable `GMP_DIR`: `GMP_DIR=/path/to/gmp/installation`
{{% /steps %}}


### Installation issues
   If you encounter issues with compiling, installing, or testing the package please file an issue on our github issues page, [https://github.com/Green-Phys/green-ac/issues](https://github.com/Green-Phys/green-ac/issues), and we will do our best to help.



{{< /tab >}}

{{< /tabs >}}
