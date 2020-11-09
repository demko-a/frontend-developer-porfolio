'use strict'

const projectsList = document.querySelector('.projects_list');
const projectContainer = document.querySelector('.project_container');

let tooltipElem = null;

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
            href=${host}
            data-tooltip="${description}">
            ${name}
        </a>
        <span class="tech">
            <b>[</b><span class="tech_name"> ${tech} </span><b>]</b>
        </span>
    </div>
    `;
    projectItem.insertAdjacentHTML('beforeend', innerHTML);
    projectsList.insertAdjacentElement('beforeend', projectItem);
}

function calcTooltipCoords(target) {
    const targetCoords = target.getBoundingClientRect();
    return {
        top: (targetCoords.top + targetCoords.height),
        left: targetCoords.left
    };
}

function onMouseover(event) {
    const tooltipContent = event.target.dataset.tooltip;
    if (!tooltipContent) return;
    if (tooltipElem) return;

    tooltipElem = document.createElement('div');
    tooltipElem.className = 'tooltip';
    tooltipElem.innerHTML = tooltipContent;

    const coords = calcTooltipCoords(event.target);

    tooltipElem.style.top = coords?.top + 'px';
    tooltipElem.style.left = coords?.left + 'px'

    projectContainer.insertAdjacentElement('beforeend', tooltipElem);
}

function onMouseout() {
    if (!tooltipElem) return;
    tooltipElem.remove();
    tooltipElem = null;
}

const getColorStyle = async function() {
    const url = "http://colormind.io/api/";
    const data = {
	model : "default",
	// input : [[44,43,44],[90,83,82],"N","N","N"]
    }

    const response = await fetch(url,  {
        method: 'POST',
        body: JSON.stringify(data)
      });

    if (!response.ok) {
        throw new Error(`Ошибка по адресу ${url}, 
        статус ошибки ${response.status}!`)
    }

    return await response.json();
}

function setColorStyle(colorStyle) {
    if (colorStyle.lenght < 5) {
        console.log('Color style not set');
        return;
    }   
    let docStyle = document.documentElement.style;
    const arrToColorString = arr => `rgb(${arr[0]}, ${arr[1]}, ${arr[2]})`;
    docStyle.setProperty('--main-light-shades', arrToColorString(colorStyle[0]));
    docStyle.setProperty('--main-light-accent', arrToColorString(colorStyle[1]));
    docStyle.setProperty('--main-brand-color', arrToColorString(colorStyle[2]));
    docStyle.setProperty('--main-dark-accent', arrToColorString(colorStyle[3]));
    docStyle.setProperty('--main-dark-shades', arrToColorString(colorStyle[4]));
}

function init() {
    getData('./db/projects.json').then(data => data.forEach(createProjectItem));
    projectContainer.addEventListener('mouseover', onMouseover);
    projectContainer.addEventListener('mouseout', onMouseout);
    
    getColorStyle().then(data => setColorStyle(data.result));
}

init();
