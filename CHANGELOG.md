# 1.2.0

New API option

watchMode: Watching pages directory to auto update routes

# 1.1.21

New match dynamic route type

```js
// Get value via props
// {id}.vue -> :id.vue
{
  props: ['id']
}

// Get value via $route.params
// _id.vue -> :id.vue
$route.params.id
```
