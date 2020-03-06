<template>
  <div id="app">
    <!-- Main Framework7 App component where we pass Framework7 params -->
    <f7App :params="{ theme: 'auto', name: 'My App', id: 'com.demoapp.test' }">
      <!-- Your main view, should have "main" prop -->
      <f7View main>
        <!-- Initial Page -->
        <f7Page>
          <!-- Top Navbar-->
          <f7Navbar title="Awesome App"></f7Navbar>
          <!-- Toolbar-->
          <f7Toolbar bottom>
            <f7Link>Link 1</f7Link>
            <f7Link>Link 2</f7Link>
          </f7Toolbar>
          <!-- Page Content -->
          <p>Page content goes here</p>
          <f7Link href="/about/">About App</f7Link>
        </f7Page>
      </f7View>
    </f7App>
  </div>
</template>

<script>
import {
  f7View,
  f7Navbar,
  f7Toolbar,
  f7Link,
  f7Page,
  f7App
} from "framework7-vue";
export default {
  components: {
    f7View,
    f7Navbar,
    f7Toolbar,
    f7Link,
    f7Page,
    f7App
  }
};
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
