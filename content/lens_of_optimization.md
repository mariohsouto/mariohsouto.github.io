Title: Optimization as a language
Date: 2019-07-10 12:00
Category: Optimization
Slug: opt_language
Authors: Mario Souto
Summary: In this first post, the optimization framework is introduced as a powerful tool for solving a wide range of problems.

This post gives an overview of what **optimization** is and illustrate what kind of problems can be solved by this technology. I hope that by the end of the post, the reader will be motivated by this topic and eager to learn more about it. More importantly, I expect the reader to be willing to try optimization on whatever problem that might be of interest.

Before starting, one side note, optimization has several names depending on the audience. The most common aliases are *mathematical programming*, *decision systems* and *operations research*. More recently, if the optimization relies on a considerable amount of data, it has also been framed as *machine learning*. As I'm going to highlight through the examples, regardless of the nomenclature, optimization is simply a set of mathematical tools that can be used to solve a wide range of problems. As <label class="margin-toggle sidenote-number">
Jagger
</label> has previously stated, the nature of the method is more intriguing than its name.
<span class="sidenote" >
*Pleased to meet you <br>
Hope you guess my name <br>
But what's puzzling you <br>
Is the nature of my game* <br>
Mick Jagger and Keith Richards. <br> Sympathy for the Devil, Beggars Banquet (1968).
<span>

In a very general form, an optimization problem can be defined as
\\[
\begin{equation}
\begin{aligned}
& \underset{x \in \mathcal{X}}{\text{optimize}}
& & f(x) \newline
& \text{subject to}
&& x \in \mathcal{C}.
\end{aligned}\label{eq_opt}
\end{equation}
\\]
The vector $x$ is called the *decision* variable and it usually represents actions or choices one is interested to make. The function $f : \mathcal{X} \rightarrow \mathbb{R}$ is the *objective* that associates each $x \in \mathcal{X}$ to a value. If the problem is a *minimization* problem, $f$ represents some kind of cost function, on the other hand, if it is a *maximization* problem, $f$ represents some sort of profit that needs to be maximized. The set $\mathcal{C}$ represents a group of constraints that the decision variables must satisfy. 

We can think of optimization as a form of [*declarative programming*](https://en.wikipedia.org/wiki/Declarative_programming), where we have variables that need to obey specific predefined rules. These rules are denoted as arithmetic expressions over the decision variables, which are the constraints of our optimization problem. This concept is compelling and suggests that one can design algorithms that can deal with a wide range of rules without the need for establishing a control flow for each different problem. In other words, the user describes the problem that needs to be optimized instead of how to solve the problem. 

To make these concepts more tangible, let's introduce a simple example from image processing.

### Image inpainting

Suppose we have a $m \times n$ black and white photograph $X^{\text{true}}$. Additionally, a set of known entries of the image were corrupted. Let's denote the entries that are not damaged by $(i, j) \in \mathcal{T}$. Our goal is to restore the original image through a process called *image inpainting* or *image interpolation*. In other words, we want to find an image $X$ such that the corrupted entries are reconstructed. This task can be cast as an optimization problem where the restored image $X$ is our decision variable.

First of all, we need constraints to ensure that the non-corrupted entries of $X$ and $X^{\text{true}}$ will match. Mathematically, this rule can be expressed as 

\\[
\begin{equation}
\begin{aligned}
& X_{i, j} = X^{\text{true}}_{i, j} \hspace{0.2cm} \forall \hspace{0.2cm} (i, j) \in \mathcal{T}.
\end{aligned}\label{eq_match}
\end{equation}\nonumber
\\]

The objective function will be to minimize the difference between entries that are adjacent. This can be achieved by minimizing the *total variation* of $X$. Where $\textbf{TV} : \mathbb{R}^{m \times n} \rightarrow \mathbb{R}$ is given by
\\[
\begin{equation}
\begin{aligned}
& \textbf{TV}(X) = \sum_{j=1}^{n-1} \sum_{i=1}^{m-1} \begin{Vmatrix}
X_{i+1, j} - X_{i, j} \newline
X_{i, j+1} - X_{i, j}
\end{Vmatrix}_2
\end{aligned}\label{eq_tv}
\end{equation}\nonumber
\\]

By putting all together we have the optimization problem
\\[
\begin{equation}
\begin{aligned}
& \underset{X}{\text{minimize}}
& & \textbf{TV}(X) \newline
& \text{subject to}
&& X_{i, j} = X^{\text{true}}_{i, j} \hspace{0.2cm} \forall \hspace{0.2cm} (i, j) \in \mathcal{T}.
\end{aligned}\label{eq_inpaint}
\end{equation}
\\]
By the end of this post, we will show how to solve (\ref{eq_inpaint}) with just a few lines of code. For now, just notice that (\ref{eq_inpaint}) is a particular case of (\ref{eq_opt}), the same is true for all the applications mentioned below. In order to see how generic and powerful the optimization framework is, let's take a look into some interesting applications.

## Successful applications

A field of which optimization has been widely used for decades is logistics. Every time one buys a product online, it is very likely that this information will be the input of an optimization algorithm that will decide which is the best delivery route. For instance, such an algorithm may find the shortest route that obeys constraints such as a delivery time window (without late-night deliveries). This class of problems, known as *vehicle routing problems*, is a core technology used in the logistics pipeline. It is important to notice that vehicle routing is just one kind of problem in logistics that is solved using optimization.
In companies like
<label class="margin-toggle sidenote-number">
Amazon
</label>
<span class="sidenote" >
In this <a href="https://blog.aboutamazon.com/innovation/how-artificial-intelligence-helps-amazon-deliver">
<em>
blog post
</em>
</a>
Russell Allgor (chief scientist at Amazon) explains the use of optimization at Amazon warehouses.
</span>
, optimization is used extensively in problems such as deciding how to optimally pack the boxes into a container, how to best move robots within a fulfillment center, choose the best place to open a new locker delivery store, to name a few.

In control theory, optimization has been used for decades with impressive results. The main idea is that we want to control a dynamical systems subject to operational constraints. For example, a self-driving car needs to change lanes very smoothly without resulting in an accident. Another successful case of optimization in control is the landing of the Falcon 9 rocket performed by <label class="margin-toggle sidenote-number"> SpaceX.
</label>
<span class="sidenote" >
<img src="/images/spacex.gif" alt="Image profile" style="width: 100%; display: block; margin-left: auto; margin-right: auto;"> Açıkmeşe, Behçet, John M. Carson, and Lars Blackmore. <br> ["Lossless convexification of nonconvex control bound and pointing constraints of the soft landing optimal control problem."](http://www.larsjamesblackmore.com/iee_tcst13.pdf) IEEE Transactions on Control Systems Technology 21.6 (2013): 2104-2113. </span>
In this case, one wants to minimize the rocket fuel while making sure that the rocket will land vertically at a specific location. This can be achieved by solving a convex optimization problem by using a technique called *lossless convexification*. Such applications have the particularity that the decision needs to be made within a timespan of milliseconds or microseconds. To do so, very efficient embedded optimization algorithms are required. 

In the field of *machine learning*, a great amount of the work done at the *training* pipeline is due to optimization. Given a data set, composed of a design matrix $X$ and a target vector $y$, estimating the model parameters can be cast as a minimization problem. In particular, estimating the unkown parameters, denoted by $w$, of a neural network model is equivalent to minimizing a loss function of a series of composite chained functions as in
\\[
\begin{equation}
\begin{aligned}
& \underset{w}{\text{minimize}}
& & \text{loss}(w, X, y) : = f_k \circ f_{k-1} \circ f_{k-2} \circ \cdots \circ f_1(w, X, y).
\end{aligned}\label{eq_deep_learning}
\end{equation}\nonumber
\\]
If the number of composite functions is sufficiently large, this technique is usually referred to as *deep learning* or even *artificial intelligence*. 

## Practitioners point of view

For the great majority of the users, optimization can be treated as a technology that provides an optimal solution given an instance of a problem. This kind of user is more interested in adequately formulating problems rather than which algorithm is going to be used to solve it. From the practitioner point of view, optimization is more of language at which the problem of interest can be properly described. 

Modeling real-world problems as an optimization problem can be challenging. More recently, the advent of open source modeling languages such as <label class="margin-toggle sidenote-number">
[CVXPY](https://www.cvxpy.org/)
</label>
<span class="sidenote" >
Diamond, Steven, and Stephen Boyd. ["CVXPY: A Python-embedded modeling language for convex optimization."](http://www.jmlr.org/papers/volume17/15-408/15-408.pdf) The Journal of Machine Learning Research 17.1 (2016): 2909-2913.
</span> and <label class="margin-toggle sidenote-number">
[JuMP](https://github.com/JuliaOpt/JuMP.jl)
</label>
<span class="sidenote" >
Dunning, Iain, Joey Huchette, and Miles Lubin. ["JuMP: A modeling language for mathematical optimization."](https://arxiv.org/pdf/1508.01982.pdf) SIAM Review 59.2 (2017): 295-320.
</span> has made the deployment of optimization much easier. The goal of these frameworks is to allow the user to model the problem in a high-level fashion while parsing to the solver is done automatically. Even though modeling languages have been around for years, the most recent ones have several advantages over their predecessors. First of all, they are open source. Additionally, they are packages built in general-purpose programming languages like Python or [Julia](https://julialang.org/). This property allows to easily integrate optimization software into the backend of different applications and also facilitates the process of teaching optimization for the general public.

### Solving image inpainting

To illustrate how easy solving an optimization problem has become, let's return to our first example. As promise let's solve the image inpainting problem (\ref{eq_inpaint}) with just a few lines of code. For this task we will use the CVXPY modeling language along with the open-source solver 
<label class="margin-toggle sidenote-number">
[SCS](https://github.com/cvxgrp/scs)
</label>
<span class="sidenote" >
O’Donoghue, Brendan, et al. ["Conic optimization via operator splitting and homogeneous self-dual embedding."](https://web.stanford.edu/~boyd/papers/pdf/scs_long.pdf) Journal of Optimization Theory and Applications 169.3 (2016): 1042-1068.
</span> 
The Python code for modeling, parsing the problem, calling the solver and retrieving the solution is the following:

<pre style='color:#000000;background:#ffffff;'><span style='color:#7f0055; font-weight:bold; '>import</span> cvxpy <span style='color:#7f0055; font-weight:bold; '>as</span> cp
<span style='color:#3f7f59; '># Create decision variable.</span>
X = cp.Variable(shape=(m, n))
<span style='color:#3f7f59; '># Build objective function.</span>
objective = cp.Minimize(cp.tv(X))
<span style='color:#3f7f59; '># Build the constraints.</span>
constraints = [X[i, j] == Xtrue[i, j] <span style='color:#7f0055; font-weight:bold; '>for</span> (i, j) <span style='color:#7f0055; font-weight:bold; '>in</span> T]
<span style='color:#3f7f59; '># Put all together as one optimization problem.</span>
problem = cp.Problem(objective, constraints)
<span style='color:#3f7f59; '># Solve the problem using SCS solver.</span>
problem.solve(verbose=True, solver=cp.SCS)
</pre>

As it can be seen, solving a complex problem reduces to a simple and elegant code <label class="margin-toggle sidenote-number"> snippet. As it was previously mentioned, there is no need to specify a particular algorithm or set of instructions.
</label>
<span class="sidenote" >
Thanks to [Steven Diamond](http://web.stanford.edu/~stevend2/) and all CVXPY contributors. </span> To see the effect of the inpaiting method, let's apply it to the image <label class="margin-toggle sidenote-number"> below.
</label>
<span class="sidenote">
[Niterói Contemporary Art Museum](https://en.wikipedia.org/wiki/Niter%C3%B3i_Contemporary_Art_Museum) (Museu de Arte Contemporânea de Niterói — MAC).
</span>
<figure>
<img src="/images/result_inpainting.jpg">
The original image is corrupted by adding the text "This is a corrupted test image. Let's recover the image by solving a total variation minimization problem!". By solving the optimization problem (\ref{eq_inpaint}), the image is recovered with a very good accuracy.
</figure>

## Suggested links (in progress)

Fortunately, there are tons of available material online about optimization. Here I tried to select a small list that the reader might find interesting. 

* [Stephen P. Boyd](https://web.stanford.edu/~boyd/) is a spectacular communicator that has two courses and a book freely available. The lectures from [Convex optimization I](http://web.stanford.edu/class/ee364a/) and his [book](https://web.stanford.edu/~boyd/cvxbook/) with [Lieven Vandenberghe](http://www.seas.ucla.edu/~vandenbe/) is, in my opinion, the best starting point to get to know more about optimization. If you decide that you are really into convex optimization, you should also check [Convex optimization II](http://stanford.edu/class/ee364b/);

* Speaking on [Vandenberghe](http://www.seas.ucla.edu/~vandenbe/), three of his courses from UCLA are freely available with excellent lecture notes. They can be found at [Linear Programming](http://www.seas.ucla.edu/~vandenbe/ee236a/ee236a.html), [Convex Optimization](http://www.seas.ucla.edu/~vandenbe/ee236b/ee236b.html) and [Optimization Methods for Large-Scale Systems](http://www.seas.ucla.edu/~vandenbe/ee236c.html);

* [Ryan Tibshirani](http://www.stat.cmu.edu/~ryantibs/) also has a great course on [Convex Optimization](http://www.stat.cmu.edu/~ryantibs/convexopt/);

* [Ben Recht](https://people.eecs.berkeley.edu/~brecht/) maintains the [argmin blog](https://www.argmin.net/) and I would also suggest his talk on [optimization at the Simons Institute](https://simons.berkeley.edu/talks/ben-recht-2013-09-04);

* The blog [*off the convex path*](http://www.offconvex.org/) maintained by [Sanjeev Arora](http://www.cs.princeton.edu/~arora/), [Moritz Hardt](https://mrtz.org/), [Nisheeth Vishnoi](http://www.cs.yale.edu/homes/vishnoi/Home.html) and [Nadav Cohen](http://www.cohennadav.com/) has a great content and is constantly updated;

* [Sébastien Bubeck](http://sbubeck.com/) also has a great blog called [
*I’m a bandit*](https://blogs.princeton.edu/imabandit/). Additionally, his [book](http://sbubeck.com/Bubeck15.pdf) on convex optimization is an excellent reference on complexity and algorithms;

* If you are into conic optimization, as you should, I highly suggest the [MOSEK blog](https://themosekblog.blogspot.com/);

* I also recommend the reader to check [Fabian Pedregosa blog](http://fa.bianp.net/);

* To be up to date with the most recent publications I would suggest the reader to check the [ArXiv Optimization and Control](https://arxiv.org/list/math.OC/recent) as well as the [*optimization-online*](http://www.optimization-online.org/) page frequently.
