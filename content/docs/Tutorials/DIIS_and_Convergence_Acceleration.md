---
title: DIIS and Convergence Acceleration
permalink: /DIIS_and_Convergence_Acceleration/
weight: 41
---

Fully self-consistent Green's function methods target solution of the Dyson equation self-consistently:

```math
G^{-1} = G^{-1}_0 - \Sigma[G],
```

where the $G$ is the full Green's function, $G_0$ is the Green's function of independent electrons, $\Sigma[G]$ is the self-energy functional depending only on the full Green's function and two-electron integrals. The self-energy has the static (Hartree--Fock) and the dynamical (frequency-dependent) parts. The specific functional dependences, such as GF2, GW, etc, are covered in the previous sections. In practice, in order to solve the Dyson equation self-consistently, one has to start from the initial guess (usually the Fock matrix from HF or DFT calculation), find the chemical potential $\mu$ and the Green's function, evaluate static and dynamical parts of self-energy, then again find the chemical potential and the Green's function, and iterate until the changes in the Green's function, self-energy, chemical potential, and total energy become smaller than the desired threshold. This direct procedure is a Green's function version of the Roothaan--Hartree--Fock procedure commonly known in standard quantum chemical textbooks. Just as the original Roothaan--Hartree--Fock algorithm, this direct procedure converges only for very simple cases. Very often such iterations diverge, and a number of algorithms has been developed to remedy this problem. 

The simplest algorithm is known as `damping`, or `simple mixing`. At a given iteration, it mixes the computed self-energy with the self-energy from the previous iteration with certain weights:

```math
\Sigma_i = \alpha\Sigma[G_{i-1}] + (1-\alpha)\Sigma_{i-1},
```
where $\Sigma_i$ is the mixed self-energy used to find the Green's function at the new iteration, $\Sigma[G_{i-1}]$ is the computed self-energy from the previously found Green's function, and $\Sigma_{i-1}$ is the damped self-energy from the previous iteration. The mixing parameter $\alpha$ is choise by the user. Thus, the self-consistency sycle becomes:
initial guess &rarr $\mu_1,G_1$ &rarr $\Sigma[G_1]$ &rarr mixed $\Sigma_1$ &rarr $\mu_2,G_2$ &rarr ...

Smaller values of $\alpha$ stabilize iterations and lead to smaller changes between iterations. That's why this approach often converges when the direct iterations diverge. In our practice, it is often sufficient to choose $\alpha$ between `0.3..0.7`. However, it is still important to pay attention to how iterations are going and to intervene if necessary. Sometimes the behavior of iterations changes as they go, and an adjustment of $\alpha$ may be needed. Although simple damping stabilizes iterations, it is often too slow in practice because it may need over a hundred iterations to converge to the final solution. 



### This part is outdated

Naive iteration is often not an efficient way to converge correlated
calculations. DIIS and related methods are more efficient. The following
talk by Pavel on DIIS gives information on background and usage of the
code.

We have two recordings of the talk. Zoom version:

{{< youtube id="mPPAuWUr_w0" >}}

Second recording of the talk, room version:

{{< youtube id="NyyCXMjFucE" >}}

Slides for the talk are available
[here](/files/Pavel_DIIS.pdf).
