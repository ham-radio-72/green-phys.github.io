---
title: Running Density Functional Theory
permalink: /Getting_Started_–_Running_Density_Functional_Theory/
weight: 15
---

A density functional calculation of a solid is always the first step in
performing a correlated calculation. The DFT calculation allows you to
understand global aspects of the band structure, compare to reference
literature results, and get a general feeling for the problem. DFT codes
are mature and foolproof.

## Step 1 – Vasp with PBE

The Vienna Ab-Initio Simulation Package [VASP](https://www.vasp.at) is a
good place to get started for standard DFT. Codes are installed on
[Pauli](/Pauli_Cluster_Information "wikilink") but running VASP requires
you to be a registered user, please contact Dominika to make sure that
you are. Following the guidelines at the VASP homepage, make sure that
you can obtain the band structure of your compound of interest. VASP is
a plane-wave code, meaning that its results will not be influenced by
your choice of basis.
[PBE](https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.77.3865)
is a very standard functional and a decent initial choice of functional.

Runxue gave an [introduction to VASP](/introduction_to_VASP "wikilink")
in our group seminar

## Step 2 – Crystal or CP2K with PBE

Next step in the workflow consists of running the same crystal in
[CP2K](https://github.com/cp2k/cp2k) or
[Crystal](https://www.crystal.unito.it/index.php). Both of these
packages are established Gaussian codes, Crystal is very fast and
implements symmetries efficiently but is somewhat limited with
pseudopotentials, while CP2K is a more established standard Gaussian DFT
code. Gaussian bases are differently biased from plane wave basis sets
with pseudopotential. Obtaining a bandstructure plot in both codes will
give you a basis for comparison. Yanbing gave an excellent [tutorial on
using Crystal](/tutorial_on_using_Crystal "wikilink").

## Step 3 – DFT in pySCF

In a third step, you will repeat the calculation that you just did in
VASP and Crystal in [PySCF](https://pyscf.org/). DFT in pySCF is much
more primitive than in the established DFT packages, and checking the
DFT results against established codes will give confidence in your
setup, which we will then use for diagrammatic calculations.