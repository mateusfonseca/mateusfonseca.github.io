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
    "c": ("programming", "C"),
    "cpp": ("programming", "C++"),
    "c++": ("programming", "C++"),
    "cmake": ("programming", "C++"),
    "csharp": ("programming", "C#"),
    "c#": ("programming", "C#"),
    "java": ("programming", "Java"),
    "javascript": ("programming", "JavaScript"),
    "typescript": ("programming", "TypeScript"),
    "kotlin": ("programming", "Kotlin"),
    "r": ("programming", "R"),
    "shell": ("programming", "Shell"),
    "html": ("programming", "HTML"),
    "html5": ("programming", "HTML"),
    "css": ("programming", "CSS"),
    "objective-c": ("programming", "Objective-C"),
    "objective-cpp": ("programming", "Objective-C++"),
    "objective-c++": ("programming", "Objective-C++"),
    "ruby": ("programming", "Ruby"),
    "starlark": ("programming", "Starlark"),
    # Frameworks
    "fastapi": ("framework", "FastAPI"),
    "flask": ("framework", "Flask"),
    "django": ("framework", "Django"),
    "streamlit": ("framework", "Streamlit"),
    "react": ("framework", "React"),
    "react-native": ("framework", "React Native"),
    "ionic": ("framework", "Ionic"),
    "dotnet": ("framework", ".NET"),
    "dotnetcore": ("framework", ".NET"),
    "dotnet-core": ("framework", ".NET"),
    "aspnet": ("framework", "ASP.NET"),
    "aspnetcore": ("framework", "ASP.NET"),
    "aspnet-core": ("framework", "ASP.NET"),
    "bootstrap": ("framework", "Bootstrap"),
    "bulma": ("framework", "Bulma"),
    "tailwind": ("framework", "Tailwind"),
    "android": ("framework", "Android"),
    "capacitor": ("framework", "Capacitor"),
    # Databases
    "mysql": ("database", "MySQL"),
    "sqlite": ("database", "SQLite"),
    "mongodb": ("database", "MongoDB"),
    "firestore": ("database", "Firestore"),
    "ef-core": ("database", "EF Core"),
    "sqlalchemy": ("database", "SQLAlchemy"),
    "mako": ("database", "SQLAlchemy"),
    # Infrastructure & DevOps
    "aws": ("infrastructure", "AWS"),
    "terraform": ("infrastructure", "Terraform"),
    "hcl": ("infrastructure", "Terraform"),
    "docker": ("infrastructure", "Docker"),
    "dockerfile": ("infrastructure", "Docker"),
    "ansible": ("infrastructure", "Ansible"),
    "github-actions": ("infrastructure", "GitHub Actions"),
    "nginx": ("infrastructure", "Nginx"),
    "gunicorn": ("infrastructure", "Gunicorn"),
    "uvicorn": ("infrastructure", "Uvicorn"),
    "firebase": ("infrastructure", "Firebase"),
    # Data Science & ML
    "tensorflow": ("data_science", "TensorFlow"),
    "keras": ("data_science", "Keras"),
    "numpy": ("data_science", "NumPy"),
    "pandas": ("data_science", "Pandas"),
    "deep-learning": ("data_science", "Deep Learning"),
    "cnn": ("data_science", "CNN"),
    "matplotlib": ("data_science", "Matplotlib"),
    "seaborn": ("data_science", "Seaborn"),
    "scikit-learn": ("data_science", "Scikit-learn"),
    # Domains
    "cloud-computing": ("domain", "Cloud Computing"),
    "cybersecurity": ("domain", "Cybersecurity"),
    "devops": ("domain", "DevOps"),
    "ci-cd": ("domain", "CI/CD"),
    "cicd": ("domain", "CI/CD"),
    "ai-ml": ("domain", "AI/ML"),
    "computer-vision": ("domain", "Computer Vision"),
    "mobile-dev": ("domain", "Mobile Development"),
    "mobile-development": ("domain", "Mobile Development"),
    "software-dev": ("domain", "Software Development"),
    "software-development": ("domain", "Software Development"),
    "game-dev": ("domain", "Game Development"),
    "web-dev": ("domain", "Web Development"),
    "web-development": ("domain", "Web Development"),
    "3d-modeling": ("domain", "3D Modeling"),
    "iac": ("domain", "IaC"),
    "cloud-security": ("domain", "Cloud Security"),
    "homomorphic-encryption": ("domain", "Homomorphic Encryption"),
    "searchable-encryption": ("domain", "Searchable Encryption"),
    "hybrid-dev": ("domain", "Hybrid Development"),
    "hybrid-development": ("domain", "Hybrid Development"),
    "cryptography": ("domain", "Cryptography"),
    # Others
    "opencv": ("others", "OpenCV"),
    "tenseal": ("others", "TenSEAL"),
    "aes": ("others", "AES"),
    "api": ("others", "API"),
    "bfv": ("others", "BFV"),
    "discogs-api": ("others", "Discogs API"),
    "fakestoreapi": ("others", "Fake Store API"),
    "google-maps-api": ("others", "Google Maps API"),
    "google-photos-api": ("others", "Google Photos API"),
    "google-places-api": ("others", "Google Places API"),
    "html-css-javascript": ("others", "HTML/CSS/JavaScript"),
    "json": ("others", "JSON"),
    "jsx": ("others", "JSX"),
    "tsx": ("others", "TSX"),
    "mvc-architecture": ("others", "MVC"),
    "mvt-architecture": ("others", "MVT"),
    "object-oriented-programming": ("others", "OOP"),
    "pycharm-ide": ("others", "PyCharm"),
    "pycharm": ("others", "PyCharm"),
    "tls": ("others", "TLS"),
    "webstorm": ("others", "WebStorm"),
    "github-api": ("others", "GitHub API"),
    "okhttp": ("others", "OkHttp"),
    "mvvm-architecture": ("others", "MVVM"),
    "rxjs": ("others", "RxJS"),
    "tesseract-ocr": ("others", "Tesseract OCR"),
    "jwt": ("others", "JWT"),
    "crud": ("others", "CRUD"),
    "dtl": ("others", "DTL"),
    "cross-platform": ("others", "Cross-Platform"),
    "erp": ("others", "ERP"),
    "dnf": ("others", "DNF"),
    "erd": ("others", "ERD"),
}

CATEGORY_ORDER = [
    "context",
    "domain",
    "programming",
    "framework",
    "database",
    "infrastructure",
    "data_science",
    "others",
]

OWNER = "mateusfonseca"
WIKI_PAGES = [
    "Portfolio-Summary",
    "Home",
]  # Checks Portfolio-Summary.md first, then Home.md
PORTFOLIO_TOPIC = "portfolio"  # Add this topic on GitHub to include a repo


def fetch_wiki_data(repo_name: str) -> dict:
    """Fetches raw Markdown from the repo's Wiki and parses # Title, intro, and bullet_points."""
    default_title = repo_name.replace("-", " ").replace("_", " ").title()
    markdown_text = None

    for page in WIKI_PAGES:
        wiki_url = (
            f"https://raw.githubusercontent.com/wiki/{OWNER}/{repo_name}/{page}.md"
        )
        resp = requests.get(wiki_url)
        print(f"[{repo_name}] GET {wiki_url} -> {resp.status_code}")
        if resp.status_code == 200 and resp.text.strip():
            markdown_text = resp.text
            break

    if not markdown_text:
        return {
            "title": default_title,
            "description": {
                "intro": "",
                "bullet_points": [],
            },
        }

    custom_title = None
    intro_lines = []
    bullet_points = []

    for raw_line in markdown_text.splitlines():
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
            "intro": " ".join(intro_lines),
            "bullet_points": bullet_points,
        },
    }


def fetch_repo_images(repo_name: str, default_branch: str = "main") -> list:
    """Recursively fetches relevant screenshots and diagrams from the repository tree."""
    headers = {"Accept": "application/vnd.github+json"}
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"

    tree_url = f"https://api.github.com/repos/{OWNER}/{repo_name}/git/trees/{default_branch}?recursive=1"
    resp = requests.get(tree_url, headers=headers)

    if resp.status_code == 404 and default_branch == "main":
        tree_url = f"https://api.github.com/repos/{OWNER}/{repo_name}/git/trees/master?recursive=1"
        resp = requests.get(tree_url, headers=headers)

    if resp.status_code != 200:
        return []

    tree_data = resp.json().get("tree", [])
    image_extensions = (".png", ".jpg", ".jpeg")

    # Excluded keywords (icons, badges, coverage reports, licenses)
    excluded_keywords = [
        "icon",
        "favicon",
        "badge",
        "coverage",
        "coveralls",
        "license",
        "hello-world",
        "hello_world",
    ]
    # Allowed parent folder keywords
    allowed_folders = ["screenshots", "diagrams", "charts"]

    images = []
    for item in tree_data:
        path = item.get("path", "")
        if item.get("type") == "blob" and path.lower().endswith(image_extensions):
            lower_path = path.lower()

            # Skip unwanted images
            if any(kw in lower_path for kw in excluded_keywords):
                continue

            # Ensure image is in root or in an allowed folder category
            path_parts = lower_path.split("/")
            is_allowed = len(path_parts) == 1 or any(
                any(af in part for af in allowed_folders) for part in path_parts[:-1]
            )

            if is_allowed:
                filename = os.path.basename(path)
                name_without_ext = os.path.splitext(filename)[0]
                # Derive clean title from filename
                title = name_without_ext.replace("-", " ").replace("_", " ").title()
                title = " ".join(
                    [
                        TAXONOMY_MAP.get(word.lower(), (None, word))[1]
                        for word in title.split(" ")
                    ]
                )

                raw_url = f"https://raw.githubusercontent.com/{OWNER}/{repo_name}/{default_branch}/{path}"
                images.append({"url": raw_url, "title": title})

    return images


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

        for tag in raw_tags:
            if tag in TAXONOMY_MAP:
                category, readable_name = TAXONOMY_MAP[tag]
                if readable_name not in taxonomy[category]:
                    taxonomy[category].append(readable_name)
            else:
                fallback_name = tag.replace("-", " ").title()
                if fallback_name not in taxonomy["others"]:
                    taxonomy["others"].append(fallback_name)

        # Sort each category alphabetically and build combined_tags in category order
        ordered_combined_tags = []
        for cat in CATEGORY_ORDER:
            taxonomy[cat].sort(key=str.lower)
            for item in taxonomy[cat]:
                if item not in ordered_combined_tags:
                    ordered_combined_tags.append(item)

        wiki_data = fetch_wiki_data(repo_name)

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
                "combined_tags": ordered_combined_tags,
                "images": fetch_repo_images(
                    repo_name, repo.get("default_branch", "main")
                ),
            }
        )

    os.makedirs("assets/data", exist_ok=True)
    with open("assets/data/repos.json", "w") as f:
        json.dump(final_projects, f, indent=4)
    print(f"Successfully generated repos.json with {len(final_projects)} projects.")


if __name__ == "__main__":
    main()
