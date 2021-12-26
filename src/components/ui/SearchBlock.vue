<template>
  <form
    class="search"
    @submit.prevent=""
  >
    <input
      ref="searchInput"
      v-model="search"
      type="text"
      class="search__input"
      :placeholder="$t('search.placeholder')"
    >

    <button
      type="submit"
      class="search__submit"
    >
      <svg-icon name="search" />
    </button>
  </form>
</template>
