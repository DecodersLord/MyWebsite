document.getElementById('menuButton').addEventListener('click', function() {
            document.getElementById('menu').classList.toggle('hidden');
        });

function blink(element) {
    element.classList.add('blink');
    setTimeout(() => {
    element.classList.remove('blink');
    }, 1000);
}

function expandCard(cardId) {
    let card = document.getElementById(cardId);
    let container = document.getElementById('cardContainer');
    for (let i = 0; i < container.children.length; i++) {
        if (container.children[i] !== card.parentElement) {
            container.children[i].style.display = 'none';
        }
    }
    card.style.display = 'block';
}


let selectedItemName = 'FrontEnd';
const skills = {
        FrontEnd: {'HTML': 90, 'CSS': 85,'TailwindCSS': 85, 'JavaScript': 80, 'React': 50},
        Backend: {'Node.js': 80, 'Python': 70, 'Java': 75},
        DevOps: {'Git': 70, 'Docker': 25},
        Database: {'Postgres': 70, 'MongoDB': 85}
    };

    function updateSkills(category) {
        if(selectedItemName != null){
            document.getElementById(selectedItemName).classList.remove('h-40');
        }
        selectedItemName = category;
        selectedItem = document.getElementById(category);
        selectedItem.classList.add('h-40');
        const skillsDiv = document.getElementById('skills');
        skillsDiv.innerHTML = '';
        for (const [skill, proficiency] of Object.entries(skills[category])) {
            const skillDiv = document.createElement('div');
            skillDiv.className = 'py-2';
            skillDiv.innerHTML = `
                <div class="flex justify-between">
                    <span>${skill}</span>
                    <span>${proficiency}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-mid-blue h-2 rounded-full" style="width: ${proficiency}%"></div>
                </div>
            `;
            skillsDiv.appendChild(skillDiv);
        }
    }

    // Default to FrontEnd skills
    updateSkills('FrontEnd');

const jobDetails = {
event1: 'Job details for Frontend Engineer at Trinkerr',
event2: 'Job details for SDE Intern at NeoCamp',
// Add more job details as needed
};

document.querySelectorAll('.event').forEach(event => {
event.addEventListener('click', function() {
    const jobId = this.id;
    document.getElementById('jobDetails').innerText = jobDetails[jobId];
});
});

// Default to first job details
document.getElementById('jobDetails').innerText = jobDetails.event1;
