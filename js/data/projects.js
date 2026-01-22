// Project data loader
const projects = [];

// Function to dynamically load project data from JSON files
export async function loadProjects() {
    const projectFiles = [
        './projects_data/proj1.json',
        './projects_data/proj2.json',
        './projects_data/proj3.json'
    ];

    for (const file of projectFiles) {
        try {
            const response = await fetch(file);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const project = await response.json();
            projects.push(project);
        } catch (error) {
            console.error(`Failed to load project from ${file}:`, error);
        }
    }
    return projects;
}

// Export the projects array for direct use after loading
export { projects };
