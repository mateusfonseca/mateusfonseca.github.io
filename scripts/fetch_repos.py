import json
import os

import requests


def main():
    # Load custom summaries metadata
    meta_path = "assets/data/projects-meta.json"
    try:
        with open(meta_path, "r") as f:
            meta_data = json.load(f)
    except FileNotFoundError:
        meta_data = {}

    # GitHub API request headers (using built-in token if available in Actions)
    headers = {"Accept": "application/vnd.github+json"}
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"

    # Fetch public repos for user mateusfonseca
    url = "https://api.github.com/users/mateusfonseca/repos?per_page=100&sort=updated"
    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        print(f"Error fetching repos: {response.status_code} - {response.text}")
        return

    repos = response.json()
    final_projects = []

    for repo in repos:
        repo_name = repo["name"]

        # Only process repos defined in your projects-meta.json file
        if repo_name in meta_data:
            custom_info = meta_data[repo_name]

            final_projects.append(
                {
                    "name": repo_name,
                    "title": repo["name"].replace("-", " ").title(),
                    "html_url": repo["html_url"],
                    "updated_at": repo["updated_at"],
                    "created_at": repo["created_at"],
                    "language": repo["language"],
                    "topics": repo.get("topics", []),
                    "description": custom_info["custom_summary"],
                    "degree": custom_info.get("degree", "bachelors"),
                }
            )

    # Ensure output directory exists
    os.makedirs("assets/data", exist_ok=True)

    # Save output json for front-end consumption
    output_path = "assets/data/repos.json"
    with open(output_path, "w") as f:
        json.dump(final_projects, f, indent=4)
    print(f"Successfully generated {output_path} with {len(final_projects)} projects.")


if __name__ == "__main__":
    main()
