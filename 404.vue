<script>
export default {
  functional: true,
  render(h) {
    return h(
      'div',
      {
        style: {
          font: '16px/1.6 Roboto, Helvetica, Neue, san-serif',
          margin: '2rem'
        }
      },
      [
        h('h1', { style: { margin: '0 0 20px 0' } }, ['Page Not Found :(']),
        h(
          'router-link',
          {
            props: {
              to: '/'
            },
            style: {
              'text-decoration': 'none',
              color: '#41b882'
            }
          },
          ['← Back to HomePage']
        )
      ]
    )
  }
}
</script>
