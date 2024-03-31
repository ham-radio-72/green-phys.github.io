---
title: DIIS and Convergence Acceleration
permalink: /DIIS_and_Convergence_Acceleration/
math: true
weight: 41
---

## Iterative procedure

Fully self-consistent Green's function methods target solution of the Dyson equation self-consistently:

$$G^{-1} = G^{-1}_0 - \Sigma[G],$$

where the $G$ is the full Green's function, $G_0$ is the Green's function of independent electrons, $\Sigma[G]$ is the self-energy functional depending only on the full Green's function and two-electron integrals. The self-energy has the static (Hartree--Fock) and the dynamical (frequency-dependent) parts. The specific functional dependences, such as GF2, GW, etc, are covered in the previous sections. In practice, in order to solve the Dyson equation self-consistently, one has to start from the initial guess (usually the Fock matrix from HF or DFT calculation), find the chemical potential $\mu$ and the Green's function, evaluate static and dynamical parts of self-energy, then again find the chemical potential and the Green's function, and iterate until the changes in the Green's function, self-energy, chemical potential, and total energy become smaller than the desired threshold. This direct procedure is a Green's function version of the Roothaan--Hartree--Fock procedure commonly known in standard quantum chemical textbooks. Just as the original Roothaan--Hartree--Fock algorithm, this direct procedure converges only for very simple cases. Very often such iterations diverge, and a number of algorithms has been developed to remedy this problem. 

## Simple damping

The simplest algorithm is known as `damping`, or `simple mixing`. At a given iteration, it mixes the computed self-energy with the self-energy from the previous iteration with certain weights:

$$
\Sigma_i = \alpha\Sigma[G_{i-1}] + (1-\alpha)\Sigma_{i-1},
$$

where $\Sigma_i$ is the mixed self-energy used to find the Green's function at the new iteration, $\Sigma[G_{i-1}]$ is the computed self-energy from the previously found Green's function, and $\Sigma_{i-1}$ is the damped self-energy from the previous iteration. The mixing parameter $\alpha$ is chosen by the user. Thus, the self-consistency cycle becomes:
initial guess &rarr; $\mu_1,G_1$ &rarr; $\Sigma[G_1]$ &rarr; mixed $\Sigma_1$ &rarr; $\mu_2,G_2$ &rarr; ...

Smaller values of $\alpha$ stabilize iterations and lead to smaller changes between iterations. That's why this approach often converges when the direct iterations diverge. In our practice, it is often sufficient to choose $\alpha$ between `0.3..0.7`. However, it is still important to pay attention to how iterations are going and to intervene if necessary. Sometimes the behavior of iterations changes as they go, and an adjustment of $\alpha$ may be needed. Although simple damping stabilizes iterations, it is often too slow in practice because it may need over a hundred iterations to converge to the final solution. Moreover, sometimes for some systems the damping iterations stagnate and create and illusion of convergence.

## DIIS

The details of the subspace iterative algorithms that we have developed are in our paper:

<https://pubs.aip.org/aip/jcp/article/156/9/094101/2840744>

Subspace iterative methods can resolve limitations of damping replacing the simple mixing by an extrapolation. Such an extrapolation is done with a linear combination of vectors from some subspace:

$$
v_{extr} = \sum_i c_i v_i,
$$

where $v_i$ is the subspace vector, $c_i$ is the extrapolation coefficient (recomputed at every iteration), $v_{extr}$ is the result of the extrapolation. The specific subspace technique (e.g., DIIS) finds the extrapolation coefficients automatically. This extrapolation scheme can be applied to any vectors. In our case, we define vectors $v_i$ as self-energies (with both static and dynamic parts) computed from the Green's function $G_{i-1}$. Every vector can be seen as a sum of the fixed-point vector (representing solution of the iterative process) and the error:

$$
v_i = v^* + e_i
$$

Thus, the vector extrapolation can be expressed as

$$
\begin{aligned}
v_{extr} &= v^*\sum_i c_i + e_{extr}, \cr
e_{extr} &= \sum_i c_i e_i
\end{aligned}
$$

In order to converge the extrapolated vectors $v_{extr}$ to $v^*$, the extrapolation coefficients must add up to one $\sum_i c_i = 1$. This condition is sometimes called as a DIIS constraint since it is directly used in the formulation of DIIS below.

**DIIS** (direct inversion in the iterative subspace) is the most common subspace convergence acceleration technique. While it was first developed to use for SCF, due to its generality, it has been also used to solve coupled-cluster amplitude equations as well as response equations. We implement the DIIS algorithm to accelerate iterations solving the Dyson equation. 

Within a given subspace, DIIS seeks to find such coefficients that $||e_{extr}||$ is minimized. Since in practice the error vectors (residuals) $e_i$ are not known, approximate residuals are used instead (see below). The minimization problem for coefficients can be reformulated in terms of the Lagrangian

$$
\begin{aligned}
L^{DIIS}(c,\lambda) &= \frac{1}{2}\sum_{ij} c_i B_{ij} c_j - \lambda \left(1-\sum_i c_i\right), \cr
B_{ij} &= \braket{e_i, e_j}
\end{aligned}
$$

The necessary condition for a minimum found from direct differentiation of the Lagrangian is

$$
\begin{pmatrix}
\mathrm{Re}(B_{11}) & \cdots & \mathrm{Re}(B_{1n}) & 1 \cr
\cdots & \cdots & \cdots \cr
\mathrm{Re}(B_{1n}) & \cdots & \mathrm{Re}(B_{nn}) & 1 \cr
      1    &  \cdots & 1 & 0
\end{pmatrix}
\begin{pmatrix}
c_1 \cr
\cdots \cr
c_n \cr
\lambda
\end{pmatrix} = 
\begin{pmatrix}
0 \cr
\cdots \cr
0 \cr
1
\end{pmatrix}
$$

Solution of this system gives the extrapolation coefficients minimizing the norm of the extrapolated residual. While on paper this system looks simple, in practice it is badly conditioned. We implement preconditioning through partitioning giving a reliable solution to this system of equations. The found coefficients are always real. 

We implemented two types of residuals: the difference residual and the commutator residual. The difference residual is defined as the difference between self-energies of the subsequent iterations:

$$
e_i^{diff} = \Sigma[G_{i-1}] - \Sigma[G_{i-2}]
$$

The commutator residual is defined as

$$
e_i^{comm}(i\omega) = [G_{i-1}(i\omega), G_0^{-1}(i\omega) - \Sigma[G_{i-1}](i\omega\) ]
$$

The commutator residual follows directly from the Dyson equation multiplied by $G$ from the left and from the right. It is a Green's function generalization of the Hartree--Fock commutator residual commonly used in practice due to their better performance than the difference residuals. Norms of both residuals go to zero once the self-consistent solution is found. In our practice, for simple systems both choices gives a comparable behaviour of iterations outperforming damping in most cases. The commutator residuals can perform better in difficult cases because they estimate error using both Green's function and self-energy on equal footing.

Our implementation in practice uses damping for the first few iterations, builds an extrapolation subspace, and continues with DIIS. Once the user-specified maximum number of subspace vectors is found, the oldest vector is removed from the subspace.
This is justified because in well-conditioned problems the coefficients of the old vectors decay as iterations proceed and eventually become very small.
