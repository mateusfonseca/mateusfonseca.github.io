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
    "3d-modeling": ("domain", "3D Modeling"),
}


def main():
    meta_path = "assets/data/projects-meta.json"
    try:
        with open(meta_path, "r") as f:
            meta_data = json.load(f)
    except FileNotFoundError:
        meta_data = {}

    headers = {"Accept": "application/vnd.github+json"}
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"

    url = "https://api.github.com/users/mateusfonseca/repos?per_page=100&sort=updated"
    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        print(f"Error fetching repos: {response.status_code} - {response.text}")
        return

    repos = response.json()
    final_projects = []

    for repo in repos:
        repo_name = repo["name"]

        if repo_name in meta_data:
            custom_info = meta_data[repo_name]

            # Initialize taxonomy categories
            taxonomy = {
                "context": [custom_info.get("context", "Personal")],
                "programming": [],
                "framework": [],
                "database": [],
                "domain": [],
                "infrastructure": [],
                "data_science": [],
                "others": [],
            }

            # Collect raw data from GitHub
            gh_lang = repo.get("language")
            gh_topics = repo.get("topics", [])

            # Combine language and topics into a normalized set of tags
            raw_tags = set()
            if gh_lang:
                raw_tags.add(gh_lang.lower().replace(" ", "-"))
            for t in gh_topics:
                raw_tags.add(t.lower())

            combined_badge_tags = set()

            for tag in raw_tags:
                if tag in TAXONOMY_MAP:
                    category, readable_name = TAXONOMY_MAP[tag]
                    if readable_name not in taxonomy[category]:
                        taxonomy[category].append(readable_name)
                    combined_badge_tags.add(readable_name)
                else:
                    # Automated fallback: if GitHub has a topic we didn't map, route it to 'others'
                    fallback_name = tag.replace("-", " ").title()
                    if fallback_name not in taxonomy["others"]:
                        taxonomy["others"].append(fallback_name)
                    combined_badge_tags.add(fallback_name)

            final_projects.append(
                {
                    "name": repo_name,
                    "title": repo["name"].replace("-", " ").title(),
                    "html_url": repo["html_url"],
                    "updated_at": repo["updated_at"],
                    "created_at": repo["created_at"],
                    "language": gh_lang,
                    "description": custom_info["custom_summary"],
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
