document.querySelectorAll('.menu-item').forEach(function(menuItem) {
    menuItem.addEventListener('click', function() {
        document.getElementById('menuButton').click();
    });
});


document.getElementById('menuButton').addEventListener('click', function() {
    document.getElementById('menu').classList.toggle('hidden');
   // document.getElementById('overlay').classList.toggle('hidden');
});

const openMenu = () => {
    // Add overflow-hidden class to the body
    document.body.classList.add('overflow-hidden');
    // Additional logic to open the menu
};

const closeMenu = () => {
    // Remove overflow-hidden class from the body
    document.body.classList.remove('overflow-hidden');
    // Additional logic to close the menu
};


function blink(element) {
    element.classList.add('blink');
    setTimeout(() => {
    element.classList.remove('blink');
    }, 1000);
}

const words = ["Priyank Sevak", "Web Developer", "Software Engineer"];
let i = 0;
let j = 0;
let currentWord = "";
let isDeleting = false;
let typing = false;

function type() {
    if (!typing){
        document.getElementById("typewriter").textContent = words[0];
        return;
    } 
    currentWord = words[i];
    let speed = 100;

    if (isDeleting) {
        document.getElementById("typewriter").textContent = currentWord.substring(0, j-1);
        j--;
        if (j == 0) {
            isDeleting = false;
            i++;
            if (i == words.length) {
                i = 0;
            }
        }
    } else {
        document.getElementById("typewriter").textContent = currentWord.substring(0, j+1);
        j++;
        if (j == currentWord.length) {
            setTimeout(function() {
                isDeleting = true;
            }, 1000); // Wait for 1 sec before starting deletion
        }
    }
    setTimeout(type, speed);
}

//type();

const triggered_div = ['#skills_section', '#projects_section','#experience_section'];
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            typing = true;
            type();
        } else {
            typing = false;
        }
    });
});

function checkDivInFocus() {
    triggered_div.forEach(trigger => {

        observer.observe(document.querySelector(trigger));
    })
}

if (window.innerWidth > 768) {
    checkDivInFocus();
}

const skills = [
        
        {'name': 'HTML', 'url': '../assets/html-5.png'},
        {'name': 'CSS', 'url': '../assets/css-3.png'},
        {'name': 'tailwind', 'url': '../assets/tailwind.png'},
        {'name': 'javascript', 'url': '../assets/JS.png'},
        {'name': 'React', 'url': '../assets/react.png'},
        {'name': 'Node.js', 'url': '../assets/nodejs.png'},
        {'name': 'Python', 'url': '../assets/python.png'},
        {'name': 'Postgres', 'url': '../assets/postgres.png'},
        {'name': 'MongoDB', 'url': '../assets/mongo.png'},
        {'name': 'Git', 'url': '../assets/git.png'},
        {'name': 'Docker', 'url': '../assets/docker.png'},
    ]

const softSkills = [
    {'name' : 'Resilient', 'url' : '../assets/html-5.png', 'detail' : 'As a software developer, my resilience enables me to adapt to new technologies and bounce back from project setbacks with renewed determination.'},
    {'name' : 'Team Player', 'url' : '../assets/html-5.png', 'detail' : 'Being a team player, I believe in collaborative problem-solving and actively seek input from my peers to deliver high-quality software solutions.'},
    {'name' : 'Critical Thinker', 'url' : '../assets/html-5.png', 'detail' : 'My critical thinking skills allow me to anticipate potential challenges in software development and devise effective strategies to address them.'},
    {'name' : 'Self Motivated', 'url' : '../assets/html-5.png', 'detail' : 'Driven by self-motivation, I continuously seek opportunities to enhance my coding skills and stay updated with the latest industry trends.'}
    
]
    function updateSkills() {
        const skillsDiv = document.getElementById('skills-list');
        skillsDiv.innerHTML = '';
        skills.forEach((skill) => {
            const skillDiv = document.createElement('div');
            skillDiv.innerHTML = `
                <li class="bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center flex-wrap gap-8 my-2  mx-2  border-2 border-nav-color 2xl:flex-row">
                    <img src=${skill.url} alt="" class="h-10 w-10">
                    
                    <h2 class="break-all font-bold text-center mb-1">${skill.name}</h2>
                </li>
            `;
            skillsDiv.appendChild(skillDiv);
        });
    }

    function updateSoftSkills(){
        const skillsDiv = document.getElementById('soft-skills-list');
        skillsDiv.innerHTML = '';
        softSkills.forEach((softSkills) => {
            const skillDiv = document.createElement('div');
            skillDiv.innerHTML = `
                <li class="bg-gray-800 p-4 rounded-lg flex gap-6 mb-2 mx-2  border-2 border-nav-color">
                    <img src=${softSkills.url} alt="" class="w-32 h-32">
                    <div class="flex flex-col">
                        <h2 class="break-all flex font-bold mb-1 text-border-color">${softSkills.name}</h2>
                        <p class="break-keep">${softSkills.detail}</p>
                    </div>
                </li>
            `;
            skillsDiv.appendChild(skillDiv);
        });
    }

    // Default to FrontEnd skills
updateSkills();
updateSoftSkills();