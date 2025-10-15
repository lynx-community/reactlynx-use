# Contributing

Thank you for your interest in contributing to ReactLynxUse!

## About ReactLynx

ReactLynxUse is built for [ReactLynx](https://lynxjs.org/react), idiomatic React on [Lynx](https://lynxjs.org). Before contributing, we recommend:

- Understanding the basics of Lynx and ReactLynx
- Reading [Thinking in ReactLynx](https://lynxjs.org/react/thinking-in-reactlynx.html)
- Familiarizing yourself with ReactLynx's dual-thread model and performance considerations

This project is inspired by and based on [react-use](https://github.com/streamich/react-use).

## Development

### Setup

```bash
pnpm install
```

### Testing

Run unit tests:

```bash
pnpm test
```

### Docs

The documentation site is powered by [rspress](https://rspress.rs/)

```bash
cd website
pnpm dev
```

## Contributing

### Existing hooks

Feel free to enhance existing hooks! Please try to:

- Maintain backward compatibility when possible
- Add tests for any new behavior
- Update documentation to reflect changes
- Follow the existing code style and patterns

### New hooks

There are some notes for adding new hooks:

- **Before you start**: It's better to open an issue to discuss your idea first
- **Implementation**: Add your hook file in the `src` directory (e.g., `src/useNewHook.ts`)
- **Testing**: Write unit tests in the tests directory (e.g., `tests/useNewHook.test.ts`)
- **Documentation**: Add English documentation in `website/docs/en` directory
- **Export**: Don't forget to export your hook in `src/index.ts`

## Code Style

Don't worry too much about code style - our linting and formatting tools will help maintain consistency.

## Thanks

Thank you again for being interested in contributing to this project!
