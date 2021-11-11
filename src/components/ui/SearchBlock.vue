<template>
  <form class="search" @submit.prevent="">
    <input
      type="text"
      v-model="search"
      class="search__input"
      :placeholder="$t('search.placeholder')"
      ref="searchInput"
    />

    <button type="submit" class="search__submit">
      <svg-icon name="search" />
    </button>
  </form>
</template>
