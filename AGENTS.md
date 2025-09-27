# Development Guidelines

## Philosophy

This project follows the UNIX philosophy:
- Write programs that do one thing and do it well
- Write programs to work together
- Write programs to handle text streams, because that is a universal interface

## Code Organization

### Command Structure
- Each command should be in its own file under `src/commands/`
- Commands should be modular and reusable
- Use clear, descriptive function names

### Output Guidelines
- **No emojis in output** - Emojis interfere with text processing and violate UNIX philosophy
- Use plain text output that can be easily parsed by other tools
- Provide machine-readable output options where appropriate
- Follow consistent formatting patterns

### Error Handling
- Return appropriate exit codes
- Write errors to stderr, not stdout
- Provide clear, actionable error messages

## Project Structure

```
src/
  commands/
    speak.ts      - Speech synthesis command
    speakers.ts   - List available speakers
    version.ts    - Version information
  index.ts        - Main entry point
```

## Rationale

### Why No Emojis?
1. **Pipeline Compatibility**: UNIX tools often pipe output between commands. Emojis can break text processing.
2. **Accessibility**: Screen readers and terminal environments may not handle emojis well.
3. **Consistency**: Plain text is predictable and works everywhere.
4. **Professional Output**: CLI tools should prioritize functionality over decoration.

### Why Separate Command Files?
1. **Maintainability**: Easier to locate and modify specific functionality
2. **Testability**: Each command can be tested in isolation
3. **Reusability**: Commands can be imported and used by other tools
4. **Code Organization**: Clear separation of concerns
