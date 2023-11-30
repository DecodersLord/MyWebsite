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

const experienceList = [
    {
        'job_title': 'Software Engineer',
        'company_name': 'Assistance Services Group – A Sykes Company',
        'location' : 'London, ON',
        'duration' : 'Sept 2021 - Present',
        'isCurrentJob': true,
        'job_duties': [
            '> Led end-to-end SDLC processes',
            '> Enhanced user experience by 25%',
            '> Exemplary problem-solving skills',
            '> Maintained high productivity under tight deadlines',
            '> Streamlined API integration with Salesforce'
        ]
    },
    {
        'job_title': 'Technical Support Specialist',
        'company_name': 'Assistance Services Group – A Sykes Company',
        'location' : 'London, ON',
        'duration' : 'March 2021 - Sept 2021',
        'isCurrentJob': false,
        'job_duties': [
            "> Developed company's Asset Management Tool",
            '> Resolved complex client issues effectively',
            '> Proactive follow-up on specialized problems',
            '> Improved support, increased issue resolution by 10%'
        ]
    },
    {
        'job_title': 'IT Operation Analyst I',
        'company_name': 'Randstad  -  TD Canada Trust ',
        'location' : 'London, ON',
        'duration' : 'Jan 2021 - Feb 2021',
        'isCurrentJob': false,
        'job_duties': [
            '> Assisted users with remote login and password resets',
            '> Documented incidents and activities for issue tracking',
            '> Resolved 40-50 inbound calls, focusing on access-related issues'
        ]
    }

]
    function displaySkills() {
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

    function displaySoftSkills(){
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

    function displaySoftSkills_sm_screen(){
        const skillsDiv = document.getElementById('soft-skills-list');
        skillsDiv.innerHTML = '';
        softSkills.forEach((softSkills) => {
            const skillDiv = document.createElement('div');
            skillDiv.innerHTML = `
                <li class="bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center flex-wrap gap-8 my-2  mx-2  border-2 border-nav-color 2xl:flex-row">
                    <img src=${softSkills.url} alt="" class="h-10 w-10">
                    
                    <h2 class="font-bold text-center mb-1">${softSkills.name}</h2>
                </li>
            `;
            skillsDiv.appendChild(skillDiv);
        });
    }

    function displayExperience() {
        const experienceDiv = document.getElementById('experience_list');
        experienceDiv.innerHTML = '';

        experienceList.forEach((experience) => {
            let duties = '';
            experience.job_duties.forEach((duty) => {
                duties += `<li>${duty}</li>`;
            });

            const experienceInnerDiv = document.createElement('div');
            experienceInnerDiv.innerHTML = `
                <div class="flex items-start">
                    <div class="hidden pt-2 w-1/2 break-keep lg:flex xl:flex 2xl:flex lg:flex-col xl:flex-col 2xl:flex-col lg:w-1/4 xl:w-1/4 2xl:w-1/4">
                        <p class="font-semibold">${experience.duration}</p>
                        <p class="text-border-color">${experience.isCurrentJob ? 'Current Job' : ''}</p>
                    </div>
                    <div class="relative">
                        <div class="absolute top-0 bottom-0 border-2 bg-white lg:left-9 xl:left-9 2xl:left-9"></div>
                        <div class="flex items-center mb-3">
                            <div class="z-10 bg-border-color ring-black absolute top-0 -left-2 mt-2 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-offset-slate-900 lg:left-6 xl:left-6 2xl:left-6"></div>
                            <div class="ml-6 mb-8 md:pr-4 md:pl-16 lg:pr-4 lg:pl-16 xl:pr-4 xl:pl-16 2xl:pr-4 2xl:pl-16">
                                <h3 class="text-3xl font-bold text-border-color">${experience.job_title}</h3>
                                <p class="font-bold pt-4 lg:hidden xl:hidden 2xl:hidden">${experience.duration} <span class="text-border-color"> ${experience.isCurrentJob ? '| Current Job' : ''}</span></p>

                                <p class="font-bold pt-4">${experience.company_name} | ${experience.location}</p>
                                <ul id="job_duties" class="font-bold list-none pt-4 leading-8 space-y-1">
                                    ${duties}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            experienceDiv.appendChild(experienceInnerDiv);
        });
    }


    // Default to FrontEnd skills
function checkScreenWidth(){
    if (window.innerWidth > 1048) {
        //type();
        displaySoftSkills();
    }
    else{
        displaySoftSkills_sm_screen();
    }
    displaySkills();
    displayExperience();
}

checkScreenWidth();

