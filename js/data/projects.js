// Project data loader
const projects = [];

// Function to dynamically load project data from JSON files
async function loadProjects() {
    const projectFiles = [
        './js/data/projects_data/proj1.json',
        './js/data/projects_data/proj2.json',
        './js/data/projects_data/proj3.json',
        './js/data/projects_data/proj4.json',
        './js/data/projects_data/proj5.json',
        './js/data/projects_data/proj6.json'
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

// Export the promise that resolves with the loaded projects
const projectsPromise = loadProjects();

export default projectsPromise; 