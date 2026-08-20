#Start with a base python image
FROM python:3.12-slim

#Copy uv into the image from the uv image
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

#Create our working directory at /app
WORKDIR /app

#Copy dependency files into image
COPY pyproject.toml uv.lock ./

#Sync and install dependencies
RUN uv sync --locked --no-install-project

#Copy the rest of the application into the image
COPY . .

RUN uv sync --locked

CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]