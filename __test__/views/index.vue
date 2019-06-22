<template>
  <div class="home">
    <p>
      <router-link to="/bar">bar</router-link>
    </p>
    <p>
      <router-link to="/bar/evillt">bar-$id</router-link>
    </p>
    <p>
      <router-link to="/foo/evillt">foo-{name} props mode</router-link>
    </p>
    <p>
      <router-link to="/page-not-found">PageNotFound</router-link>
    </p>
  </div>
</template>
