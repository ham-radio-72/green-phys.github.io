---
title: Lattice Parameters and Geometries
weight : 14
math: true
---

## Getting the lattice parameters

So far, we do not perform geometry optimization. This means that you
will start your setup from a fixed arrangement of atoms in a unit cell.
Likely you already know the geometry, unit cell distance, etc. from the
literature. If you do not, you can perform a literature search for this
particular compound using this experimental database:

[`https://icsd.fiz-karlsruhe.de/search/basic.xhtml`](https://icsd.fiz-karlsruhe.de/search/basic.xhtml)

There are several alternative databases where you can get additional
information. Among them is the materials project:

[`https://materialsproject.org`](https://materialsproject.org)

These databases or the linked papers will provide you with the unit cell
information, the space-group information, and the arrangement of atoms
in the unit cell. Generically you will get three lengths (a, b, c) and
three angles (α,β,γ). You will use this information to generate the
three unit cell vectors as a 3x3 matrix. Check your favorite textbook
for instructions; for instance in a simple cubic lattice the vectors (in
units of the lattice spacing a) are $\alpha$


$$ \begin{align*}
 a_1=\begin{pmatrix}1&0&0\end{pmatrix} \cr
 a_2=\begin{pmatrix}0&1&0\end{pmatrix} \cr
 a_3=\begin{pmatrix}0&0&1\end{pmatrix}
\end{align*}
$$


In a body-centered cubic system they would be

$$ \begin{align*}
a_1=\begin{pmatrix}1/2&1/2&-1/2\end{pmatrix}\cr
a_2=\begin{pmatrix}-1/2&1/2&1/2\end{pmatrix}\cr
a_3=\begin{pmatrix}1/2&-1/2&1/2\end{pmatrix}
\end{align*}$$

...and in an fcc lattice they would be

$$\begin{align*}
a_1=\begin{pmatrix}1/2&1/2&0\end{pmatrix}\cr
a_2=\begin{pmatrix}0&1/2&1/2\end{pmatrix}\cr
a_3=\begin{pmatrix}1/2&0&1/2\end{pmatrix}
\end{align*}$$

Note that the conventional unit cell is often much larger, so make sure
to take the primitive cell. Also note that anti-ferromagnetic order will
enlarge the non-magnetic unit cell, since it will lead to inequivalent
atoms of the same type.

## The example of MnO

As an example, consider MnO. According to the materials databases the
material is cubic, crystallizing in the space group Fm-3m   (225). The
lattice distance is

`a=4.446`

but for consistency with our paper we will use

`a=4.445`

The structure is face centered cubic. The Mn atoms are located at the
origin, the oxygen atoms along the diagonal at
$\begin{pmatrix}a/2&a/2&a/2\end{pmatrix}$. Because of anti-ferromagnetic
ordering, we need to repeat the Mn atom along the diagonal, such that a
second Mn atom sits at $\begin{pmatrix}a &a&a\end{pmatrix}$, and a
second oxygen one at $\begin{pmatrix}3a/2&3a/2&3a/2\end{pmatrix}$. The
code will then require the following input: a file a.dat that describes
the unit cell vectors, and a file atoms.dat that has the location of the
atoms.

`atoms.dat:`

```
Mn 0.0 0.0 0.0
O 2.22250, 2.22250, 2.22250
Mn 4.44500, 4.44500, 4.44500
O 6.66750, 6.66750, 6.66750
```

`a.dat:`

```
4.44500 2.22250 2.22250
2.22250 4.44500 2.22250
2.22250 2.22250 4.44500
```

## Using ASE scripts to determine lattice geometry and atom positions

The [Atomic Simulation Environment](https://wiki.fysik.dtu.dk/ase/) is a
collection of useful tools for doing solid state simulations. You can
obtain the information used above directly from the ASE crystal
environment, using a modification of the following script. Replace the
unit cell parameters and atom positions with the information you find in
the materialsproject or karlsruhe databases.

```python
import numpy as np
from ase.spacegroup import crystal
from ase.spacegroup import Spacegroup

# Unit cell parameters
a, b, c = 4.0834, 4.0834, 4.0834
alpha, beta, gamma = 90, 90, 90
group = 225

'''
Construct unit cell. 
a) if primite_cell=False, a convention unit cell will be generated.
b) bases should be given in units of a, b, c 
'''

cc = crystal(symbols=['Li','H'],
             basis=[(0.0, 0.0, 0.0),(0.5, 0.5, 0.5)],
             spacegroup=group,
             cellpar=[a, b, c, alpha, beta, gamma], primitive_cell=True)

# Lattice vector
print(cc.get_cell())

# Atoms inside the unit cell
print(cc.get_chemical_symbols())

# Atom positions  
print(cc.get_positions())

# Special k points
'''
Get Bravais lattice of unit cell cc. 
Note that the Bravais lattice of a conventional unit cell is different 
from the one of a primitive unit cell. So does the special points. 
'''
lat = cc.cell.get_bravais_lattice()

# Special k points
print(lat.get_special_points())

# k-path
path = cc.cell.bandpath('GX', npoints=50)

# The kpoints are given in units of the reciprocal lattice vector.
print("Size of k-path: ", path.kpts.shape)

# Details of the space group
sp = Spacegroup(group)
print(sp)
```

## Right-handedness of coordinate system

Beware: the coordinate system for the lattices has to be right-handed
(due to some internal pySCF workings). If it is not, the code will
report

```
Lattice are not in right-handed coordinate system. Please correct your lattice vectors
```

In that case please swap the order of your lattice vectors until they
are in the proper ordering.

## Generating High-Symmetry Path Using ASE Scripts

When creating a band structure plot, you might need to generate a
high-symmetry path. To do this, you can follow the steps outlined below
(you can also refer to this paper for more information about k-paths:
<https://doi.org/10.1016/j.commatsci.2010.05.010>):

```python
import numpy as np
from ase.dft.kpoints import get_special_points, bandpath, special_paths
# Define lattice vectors in Cartesian coordinates 
lattice_vectors = np.array([[4.1705 , 2.08525, 2.08525], 
                            [2.08525, 4.1705 , 2.08525], 
                            [2.08525, 2.08525, 4.1705 ]])
  
# Output high symmetry points in reciprocal lattice vector units
high_symmetry_points = get_special_points(lattice_vectors)
print("Available high symmetry points are:\n", high_symmetry_points, '\n')
 
# Output default high symmetry path
default_path = special_paths["rhombohedral type 1"]
print("Default high symmetry path is:\n", default_path, '\n')
 
# Specify high symmetry points along the desired path
# Note: ',' denotes a jump between neighboring points, meaning no 
# additional points will be sampled between them
path = "GLB1,BZGX,QFP1Z,LP" 
num_points = 200 # Define the total number of points 
 
# Generate high symmetry path
kpath = bandpath(path, lattice_vectors, npoints=num_points) 
path, special_points, labels = kpath.get_linear_kpoint_axis() 
print("Scaled high symmetry points along the path are:\n", kpath.kpts, '\n')
 
# The following postprocessing allows the path, special_points, and labels 
# to be directly used for plotting.

# Find indices where adjacent elements in special_points are equal
indices = np.where(special_points[:-1] == special_points[1:])[0]
# For each index, create a combined label and replace the original label with it
for index in indices:
    combined_label = labels[index] + "|" + labels[index+1]
    labels[index] = ""
    labels[index+1] = combined_label
```
