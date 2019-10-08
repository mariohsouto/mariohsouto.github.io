Title: Differentiating an optimal solution
Date: 2019-10-02 12:00
Category: Optimization, Differentiable Programming
Slug: diff_opt
Authors: Mario Souto
Summary: How can we differentiate the optimal solution with respect to the problem data.

def

Most of the ideas presented in this post are based on the work of [Brandon Amos](http://bamos.github.io/) and [Zico Kolter](http://zicokolter.com/). With that being said, I highly recomend the reader to take a look into the [OptNet](https://arxiv.org/pdf/1703.00443.pdf) paper and Brandon's Ph.D. [thesis](http://reports-archive.adm.cs.cmu.edu/anon/anon/usr/ftp/2019/CMU-CS-19-109.pdf). More recently, [Stephen Boyd](http://web.stanford.edu/~boyd/) group has also made a very insteresting [paper](https://arxiv.org/pdf/1904.09043.pdf) on the subject.

<br/>

# Jacobians and partial derivatives

Before we can start to look at optimization problems we need to introduce some useful concepts. Let $F : \mathbb{R}^n \rightarrow \mathbb{R}^m$ be a differentiable multivariate mapping. The correspondent Jacobian is a matrix containing the partial derivatives. In the literature the Jocabian can have different notations, such as $J_F$ or $D_x (F)$, in this post we refer to the Jacobian as $\partial F / \partial x \in \mathbb{R}^{m \times n}$, as given by 
\\[
\begin{equation}
\begin{aligned}
& \frac{\partial F}{\partial x} = \begin{bmatrix}
    \partial F_1 / \partial x_1 & \partial F_1 / \partial x_2 & \dots  & \partial F_1 / \partial x_n \newline
    \vdots  & \vdots  & & \vdots \newline
    \partial F_m / \partial x_1 & \partial F_m / \partial x_2 & \dots  & \partial F_m / \partial x_n
\end{bmatrix}.
\end{aligned}
\end{equation}\nonumber
\\]

We can also extend this definition to mappings from matrices to matrices. In that case, the mapping $F : \mathbb{R}^{p \times q} \rightarrow \mathbb{R}^{m \times n}$ has a Jacobian $\partial F / \partial x \in \mathbb{R}^{m n \times p q}$ of the form
\\[
\begin{equation}
\begin{aligned}
& \frac{\partial F}{\partial x} = \begin{bmatrix}
    \partial F_{1,1} / \partial X_{1,1} & \partial F_{1,1} / \partial X_{2,1} & \dots & \partial F_{1,1} / \partial X_{p,1} & \partial F_{1,1} / \partial X_{1,2} & \dots  &  \partial F_{1,1} / \partial X_{p,q} \newline
    \vdots  & & \vdots & & \vdots & & \vdots \newline
    \partial F_{m,1} / \partial X_{1,1} & \partial F_{m,1} / \partial X_{2,1} & \dots & \partial F_{m,1} / \partial X_{p,1} & \partial F_{m,1} / \partial X_{1,2} & \dots  &  \partial F_{m,1} / \partial X_{p,q} \newline
    \vdots  & & \vdots & & \vdots & & \vdots \newline
    \partial F_{m,n} / \partial X_{1,1} & \partial F_{m,n} / \partial X_{2,1} & \dots & \partial F_{m,n} / \partial X_{p,1} & \partial F_{m,n} / \partial X_{1,2} & \dots  &  \partial F_{m,n} / \partial X_{p,q}
\end{bmatrix},
\end{aligned}
\end{equation}\nonumber
\\]
which is a vectorized version of the usual Jacobian as in $\frac{\partial \text{vec}(F(X))}{\partial \text{vec}(X)}$.

## The implicit function theorem

Let $F : \mathbb{R}^{n + m} \rightarrow \mathbb{R}^n$ be a differentiable mapping and $(y, \theta) \in \mathbb{R}^n \times \mathbb{R}^m$ be a root of $F$, i.e. $F(y, \theta) = 0$. If the partial Jacobian $J_{F,y}$ is invertible, then there exists a neighborhood $U \subset \mathbb{R}^m$ containing $\theta$ such that $y = z(\theta)$ is a unique, continuous and differentiable function on $U$. With this parametrization, we have that
\\[
\begin{equation}
\begin{aligned}
& F(z(\theta), \theta) = 0 \hspace{0.2cm} \forall \hspace{0.2cm} \theta \in U,
\end{aligned}
\end{equation}\nonumber
\\]
and by taking the derivative of both sides
\\[
\begin{equation}
\begin{aligned}
& \frac{\partial F(z(\theta), \theta)}{\partial \theta} = \frac{\partial F(z(\theta), \theta)}{\partial \theta} + \frac{\partial F(z(\theta), \theta)}{\partial z(\theta)} \frac{\partial z(\theta)}{\partial \theta} = 0.
\end{aligned}
\end{equation}\nonumber
\\]
As a consequence we can find $\partial z(\theta) / \theta \in \mathbb{R}^{n \times m}$ by solving 
\\[
\begin{equation}
\begin{aligned}
& \frac{\partial z(\theta)}{\theta_j} = - \left( \frac{\partial F(z(\theta), \theta)}{\partial z(\theta)} \right)^{-1} \frac{\partial F(z(\theta), \theta)}{\partial \theta_j} \hspace{0.2cm} \forall \hspace{0.2cm} j = 1, \dots, m.
\end{aligned}\label{eq_implicit}
\end{equation}
\\]

<br/>

# Differentiating the optimal solution

Now lets see how we can use of the implicit function theorem as a tool for differentiating an optimal solution of an optimization problem. Consider the case of an equality constrained convex quadratic minimization problem that is parametrized by a variable $\theta \in \mathbb{R}^k$.
\\[
\begin{equation}
\begin{aligned}
& \underset{x \in \mathbb{R}^n}{\text{minimize}}
& & (1/2) x^T P(\theta) x + q(\theta)^T x \newline
& \text{subject to}
&& A(\theta) x = b(\theta).
\end{aligned}\label{eq_qp}
\end{equation}\nonumber
\\]
The KKT optimality conditions in matrix form for this problem are
\\[
\begin{equation}
\begin{aligned}
& \begin{bmatrix}
P(\theta) & A(\theta)^T  \newline
A(\theta) & 0
\end{bmatrix} \begin{pmatrix} x \newline \nu \end{pmatrix} = \begin{pmatrix} -q(\theta) \newline b(\theta) \end{pmatrix}.
\end{aligned}\label{qp_kkt}
\end{equation}\nonumber
\\]
Let $z = \begin{pmatrix} x \newline \nu \end{pmatrix} \in \mathbb{R}^{m + n}$, we can express the KKT conditions in terms of the mapping $F : \mathbb{R}^{m + n + k} \rightarrow \mathbb{R}^{m + n}$ as the following
\\[
\begin{equation}
\begin{aligned}
& F(z(\theta), \theta) = \underbrace{\begin{bmatrix}
P(\theta) & A(\theta)^T  \newline
A(\theta) & 0
\end{bmatrix}}_{Q \in \hspace{0.01cm} \mathbb{S}^{m + n}} z(\theta) + \begin{pmatrix} q(\theta) \newline -b(\theta) \end{pmatrix} = 0.
\end{aligned}
\end{equation}\nonumber
\\]
Firstly, we note that $\frac{\partial F(z(\theta), \theta)}{\partial z(\theta)} = Q$. By applying the implicit function theorem (\ref{eq_implicit}) we have that 
\\[
\begin{equation}
\begin{aligned}
& \frac{\partial z(\theta)}{\theta_j} = - Q^{-1} \frac{\partial F(z(\theta), \theta)}{\partial \theta_j} \hspace{0.2cm} \forall \hspace{0.2cm} j = 1, \dots, m.
\end{aligned}\label{forward_diff} 
\end{equation}
\\]

In order to understand how this would work in practice let's explore two different kinds of parametrizations.

## Case where only $b$ is parametrized in terms of $\theta$.

Suppose that $b$ is a map of $\theta \in \mathbb{R}^m$. In this case, we have that
\\[
\begin{equation}
\begin{aligned}
& \frac{\partial F(z(\theta), \theta)}{\partial \theta} = - \begin{bmatrix} 0 \newline \frac{\partial b(\theta)}{\partial \theta} \end{bmatrix} \in \mathbb{R}^{m + n \times m}.
\end{aligned}
\end{equation}\nonumber
\\]
Let the map be defined as $b(\theta) = I_{(m \times m)} \theta$, in order to find $\partial F / \partial \theta$ we need to solve all $m$ systems
\\[
\begin{equation}
\begin{aligned}
& \frac{\partial z(\theta)}{\partial \theta} = Q^{-1} \begin{bmatrix} 0 \newline I_{(m \times m)} \end{bmatrix}.
\end{aligned}\label{forward_b}
\end{equation}
\\]

## Case where only $A$ is parametrized in terms of $\theta$.

This case is slightly more tricky since $A$ is a $m \times n$ matrix. The partial derivative is then given by 
\\[
\begin{equation}
\begin{aligned}
& \frac{\partial F(z(\theta), \theta)}{\partial \theta} = \begin{bmatrix} \frac{\partial A^T(\theta) \nu}{ \partial A(\theta)} \frac{\partial A(\theta)}{\partial \theta} \newline \frac{\partial A(\theta) x}{ \partial A(\theta)} \frac{\partial A(\theta)}{\partial \theta} \end{bmatrix} \in \mathbb{R}^{m + n \times m n}.
\end{aligned}
\end{equation}\nonumber
\\]

Lets define the parametrization of $A$ in terms of a simple function such as $A(\theta) = \mathbb{1}_{m \times n} \odot \theta$ where $\theta \in \mathbb{R}^{m \times n}$. Similarly to the previous case, to obtain $\partial F / \partial \theta$ we need to solve all $m n$ systems

\\[
\begin{equation}
\begin{aligned}
& \frac{\partial z(\theta)}{\partial \theta} = - Q^{-1} \begin{bmatrix} I_{(n \times n)} \otimes \nu^T \newline x^T \otimes I_{(m \times m)} \end{bmatrix}.
\end{aligned}\label{forward_A}
\end{equation}
\\]

<br/>

# Backpropagation through the optimal solution

So far we have explicitely build the Jacobian matrix $\partial z(\theta) / \partial \theta$. For several resons this might not be the best strategy. Firstly the Jacobian might be too big to be stored in memory and secondly building the Jacobian requires us to solve $k$ linear systems. As we will see in the following, if $k$ is bigger than the size of $z$ it might be more efficent to compute the adjoint of the Jacobian.

It is easy to see that you will need x passes through...

Instead of explicitely building the Jacobian we can

adjoint

\\[
\begin{equation}
\begin{aligned}
& \left( \frac{\partial \ell (z(\theta))}{\partial \theta} \right)^T = - \left( \frac{\partial F(z(\theta), \theta)}{\partial \theta} \right)^T \left( Q^{-1} \right)^T \left( \frac{\partial \ell (z(\theta))}{\partial z(\theta)} \right)^T.
\end{aligned}\label{backprop}
\end{equation}
\\]
If we refer to $\omega \in \mathbb{R}^{m + n \times q}$ as the solution of all $m + n$ systems as in
\\[
\begin{equation}
\begin{aligned}
& \omega = \left( Q^{-1} \right)^T \left( \frac{\partial \ell (z(\theta))}{\partial z(\theta)} \right)^T,
\end{aligned}
\end{equation}\nonumber
\\]
we can express the gradients in terms of $\omega$. In this case, instead of solving $k$ linear systems we need to solve $m + n$. Let's return the previous example to see how that would play out.

## Backpropagation w.r.t. $b$

By applying the formula (\ref{forward_b}) to the backward propagation equation in (\ref{backprop}), we get the simple formula of the derivative of $\ell$ with respect to $b$.
\\[
\begin{equation}
\begin{aligned}
& \frac{\partial \ell (z(b))}{\partial b} = \begin{bmatrix} 0 \newline w \end{bmatrix}
\end{aligned}
\end{equation}\nonumber
\\]

<br/>

# Differentiable programming

The idea of make optimization programs differetiable can be seen as a particular instance of the effort of making everything differentiable. If a computer program is diferentiable one optimize 

[*differentiable programming*](https://en.wikipedia.org/wiki/Differentiable_programming). In a brief [post](https://www.facebook.com/yann.lecun/posts/10155003011462143), Yann LeCun has called atention to differentiable programming as a generalization of deep learning:
<div class="epigraph">
<blockquote>
<p>
OK, Deep Learning has outlived its usefulness as a buzz-phrase.
Deep Learning est mort. Vive Differentiable Programming! <br/>
Yeah, Differentiable Programming is little more than a rebranding of the modern collection Deep Learning techniques, the same way Deep Learning was a rebranding of the modern incarnations of neural nets with more than two layers. <br/>
But the important point is that people are now building a new kind of software by assembling networks of parameterized functional blocks and by training them from examples using some form of gradient-based optimization.


## Further reading

For the ones that are interested in the subject I would highly recomend the following reads:

* [Backprop is not just the chain rule](https://timvieira.github.io/blog/post/2017/08/18/backprop-is-not-just-the-chain-rule/) by Tim Vieira;

* 

