const projects = [];

export async function loadProjects() {
    const projectFiles = [
        './projects_data/proj1.json',
        './projects_data/proj2.json',
        './projects_data/proj3.json'
    ];

    for (const file of projectFiles) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/bf38b77b-cd3a-4dfa-a70d-82da814616e6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'projects.js:13',message:'Attempting to fetch project file',data:{file: file},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'1'})}).catch(()=>{});
        // #endregion
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

export { projects };