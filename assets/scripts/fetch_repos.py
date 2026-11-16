import json
import os

import requests

# Master taxonomy mapping dictionary
TAXONOMY_MAP = {
    # Contexts
    "bachelors": ("context", "Academic (BSc)"),
    "masters": ("context", "Academic (MSc)"),
    "personal": ("context", "Personal"),
    "professional": ("context", "Professional"),
    # Programming Languages
    "python": ("programming", "Python"),
    "c": ("programming", "C/C++"),
    "cpp": ("programming", "C/C++"),
    "csharp": ("programming", "C#"),
    "java": ("programming", "Java"),
    "javascript": ("programming", "JavaScript"),
    "typescript": ("programming", "TypeScript"),
    "kotlin": ("programming", "Kotlin"),
    "r": ("programming", "R"),
    "shell": ("programming", "Shell Scripting"),
    # Frameworks
    "fastapi": ("framework", "FastAPI"),
    "flask": ("framework", "Flask"),
    "django": ("framework", "Django"),
    "streamlit": ("framework", "Streamlit"),
    "react": ("framework", "React"),
    "react-native": ("framework", "React Native"),
    "ionic": ("framework", "Ionic"),
    "dotnet": ("framework", "ASP.NET"),
    "aspnetcore": ("framework", "ASP.NET"),
    "bootstrap": ("framework", "Bootstrap"),
    "bulma": ("framework", "Bulma"),
    "tailwind": ("framework", "Tailwind"),
    "android": ("framework", "Android"),
    # Databases
    "mysql": ("database", "MySQL"),
    "sqlite": ("database", "SQLite"),
    "mongodb": ("database", "MongoDB"),
    "firestore": ("database", "Firestore"),
    # Infrastructure & DevOps
    "aws": ("infrastructure", "AWS"),
    "terraform": ("infrastructure", "Terraform"),
    "docker": ("infrastructure", "Docker"),
    "ansible": ("infrastructure", "Ansible"),
    "github-actions": ("infrastructure", "GitHub Actions"),
    "nginx": ("infrastructure", "Nginx"),
    "gunicorn": ("infrastructure", "Gunicorn"),
    "uvicorn": ("infrastructure", "Uvicorn"),
    # Data Science & ML
    "tensorflow": ("data_science", "TensorFlow"),
    "keras": ("data_science", "Keras"),
    "numpy": ("data_science", "NumPy"),
    "pandas": ("data_science", "Pandas"),
    # Domains
    "cloud-computing": ("domain", "Cloud Computing"),
    "cybersecurity": ("domain", "Cybersecurity"),
    "devops": ("domain", "DevOps"),
    "ci-cd": ("domain", "CI/CD"),
    "ai-ml": ("domain", "AI/ML"),
    "computer-vision": ("domain", "Computer Vision"),
    "mobile-dev": ("domain", "Mobile Development"),
    "software-dev": ("domain", "Software Development"),
    "game-dev": ("domain", "Game Development"),
    "web-dev": ("domain", "Web Development"),
    "3d-modeling": ("domain", "3D Modeling"),
    # Others
    "blender": ("others", "Blender"),
    "console-application": ("others", "Console Application"),
    "opencv": ("others", "OpenCV"),
    "pytest": ("others", "Pytest"),
    "tenseal": ("others", "TenSEAL"),
    "unity": ("others", "Unity"),
}

OWNER = "mateusfonseca"
WIKI_PAGE = "Portfolio-Summary"  # Or "Home" if you use the default wiki landing page
PORTFOLIO_TOPIC = "portfolio"  # Add this topic on GitHub to include a repo


def fetch_wiki_data(repo_name: str, fallback_description: str) -> dict:
    """Fetches raw Markdown from the repo's Wiki and parses # Title, intro, and bullet_points."""
    default_title = repo_name.replace("-", " ").replace("_", " ").title()
    wiki_url = (
        f"https://raw.githubusercontent.com/wiki/{OWNER}/{repo_name}/{WIKI_PAGE}.md"
    )
    resp = requests.get(wiki_url)

    if resp.status_code != 200 or not resp.text.strip():
        return {
            "title": default_title,
            "description": {
                "intro": fallback_description or "",
                "bullet_points": [],
            },
        }

    custom_title = None
    intro_lines = []
    bullet_points = []

    for raw_line in resp.text.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        if line.startswith("# ") and custom_title is None:
            custom_title = line[2:].strip()
        elif line.startswith("#"):
            continue
        elif line.startswith(("- ", "* ")):
            bullet_points.append(line[2:].strip())
        else:
            intro_lines.append(line)

    return {
        "title": custom_title or default_title,
        "description": {
            "intro": " ".join(intro_lines)
            if intro_lines
            else (fallback_description or ""),
            "bullet_points": bullet_points,
        },
    }


def main():
    headers = {"Accept": "application/vnd.github+json"}
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"

    url = f"https://api.github.com/users/{OWNER}/repos?per_page=100&sort=updated"
    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        print(f"Error fetching repos: {response.status_code} - {response.text}")
        return

    repos = response.json()
    final_projects = []

    for repo in repos:
        gh_topics = [t.lower() for t in repo.get("topics", [])]

        # Only include repos explicitly tagged with the 'portfolio' topic
        if PORTFOLIO_TOPIC not in gh_topics:
            continue

        repo_name = repo["name"]

        taxonomy = {
            "context": [],
            "programming": [],
            "framework": [],
            "database": [],
            "domain": [],
            "infrastructure": [],
            "data_science": [],
            "others": [],
        }

        # Fetch multi-language breakdown
        languages_url = repo.get("languages_url")
        repo_languages = []
        if languages_url:
            lang_response = requests.get(languages_url, headers=headers)
            if lang_response.status_code == 200:
                repo_languages = list(lang_response.json().keys())

        raw_tags = set()
        for lang in repo_languages:
            raw_tags.add(lang.lower().replace(" ", "-"))

        for t in gh_topics:
            if t != PORTFOLIO_TOPIC:  # Don't render 'portfolio' as a card badge
                raw_tags.add(t)

        combined_badge_tags = set()

        for tag in raw_tags:
            if tag in TAXONOMY_MAP:
                category, readable_name = TAXONOMY_MAP[tag]
                if readable_name not in taxonomy[category]:
                    taxonomy[category].append(readable_name)
                combined_badge_tags.add(readable_name)
            else:
                fallback_name = tag.replace("-", " ").title()
                if fallback_name not in taxonomy["others"]:
                    taxonomy["others"].append(fallback_name)
                combined_badge_tags.add(fallback_name)

        wiki_data = fetch_wiki_data(repo_name, repo.get("description"))

        final_projects.append(
            {
                "name": repo_name,
                "title": wiki_data["title"],
                "html_url": repo["html_url"],
                "updated_at": repo["updated_at"],
                "created_at": repo["created_at"],
                "language": repo.get("language"),
                "description": wiki_data["description"],
                "taxonomy": taxonomy,
                "combined_tags": list(combined_badge_tags),
            }
        )

    os.makedirs("assets/data", exist_ok=True)
    with open("assets/data/repos.json", "w") as f:
        json.dump(final_projects, f, indent=4)
    print(f"Successfully generated repos.json with {len(final_projects)} projects.")


if __name__ == "__main__":
    main()
