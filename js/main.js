'use strict'

const projectsList = document.querySelector('.projects_list');

const getData = async function(url) {
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Ошибка по адресу ${url}, 
		статус ошибки ${response.status}!`)
	}

	return await response.json();
}

function createProjectItem(project) {
    const {
        name,
        description,
        github_link,
        host,
        tech
    } = project;

    const projectItem = document.createElement('li');
    projectItem.className = 'projects_item';
    const innerHTML = `
    <div class="project_item_content">
        <a class="projects_link" 
            href=${host}>
            ${name}
        </a>
        <span>
            <b>[</b><span class="tech_name"> ${tech} </span><b>]</b>
        </span>
    </div>
    `;
    projectItem.insertAdjacentHTML('beforeend', innerHTML);
    projectsList.insertAdjacentElement('beforeend', projectItem);
}

getData('./db/projects.json').then(data => data.forEach(createProjectItem));