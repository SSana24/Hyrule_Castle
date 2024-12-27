# The Hyrule Castle Game - Dockerized

Welcome to **The Hyrule Castle Game**! This project is containerized using Docker, allowing for easy deployment and execution of the game. The game logic is implemented in TypeScript and runs in Node.js.

## Description

The Hyrule Castle Game is a turn-by-turn RPG game. You incarnate a character that challenges the Hyrule Castle, a tower composed of 10 floors. Each floor you encounter an enemy and on the last floor, you challenge the Boss. 

---

## Prerequisites

Ensure you have the following installed:

- [Docker](https://www.docker.com/)

---

## How to Build and Run the Game

### 1. Build the Docker Image

```bash
docker build -t hyrule_castle_game .
```

- **`-t hyrule_castle_game`**: Tags the image with the name `hyrule_castle_game`.
- The `.` indicates Docker should build from the current directory.

### 2. Run the Game Container

```bash
docker run hyrule_castle_game
```

This will run the game in its default mode.

### 3. Run with a Specific Mode (Optional)

```bash
docker run -e MODE=modded_game hyrule_castle_game
```

- **`-e MODE=modded_game`**: Runs the game in `advanced` mode. The default is `base_game`.

---

## Dockerfile Breakdown

```dockerfile
FROM node:20  # Base image with Node.js 20
WORKDIR /app  # Sets the working directory
RUN npm install -g typescript  # Installs TypeScript globally

COPY TheHyruleCastle/base_game/package.json .  # Copies dependencies
RUN npm install  # Installs necessary packages

COPY TheHyruleCastle/ .  # Copies the game files
COPY ./*.json .  # Copies all JSON configuration files

ENV MODE=base_game  # Default mode of the game
CMD ["sh", "-c", "node $MODE/main.js"]  # Runs the game in the specified mode
```

---

## Development

To make changes to the game:

1. Modify the TypeScript files in `TheHyruleCastle/base_game/`.
2. Rebuild the Docker image.
3. Run the updated container.

To compile TypeScript manually:

```bash
npx tsc TheHyruleCastle/base_game/main.ts
```

---

## Troubleshooting

- **Container fails to start**: Ensure all dependencies are correctly installed by checking `package.json`.
- **File not found errors**: Verify that the paths in the Dockerfile match your project structure.
- **Docker permission issues**: Try running Docker commands with `sudo`.

---

## Contributing

Contributions are welcome! Feel free to fork the project, open pull requests, or submit issues.

---

## License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

---

Happy gaming and exploring! 🎮

