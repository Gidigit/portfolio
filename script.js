document.addEventListener('DOMContentLoaded', function() {
    // Menu Toggle Functionality
    const menuToggle = document.getElementById('menu-icon');
    const navLinks = document.querySelector('.navbar'); // Ensure this matches your HTML ID
    

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Role Changing Animation
    const roles = ["Web Developer", "FrontEnd Developer", "UI/UX Designer"];
    const roleElement = document.getElementById('role');

    if (roleElement) {
        let currentIndex = 0;
        let nextIndex = 1;

        function changeRole() {
            roleElement.classList.add('slide-out');
            
            // Transition to the new role
            setTimeout(() => {
                roleElement.textContent = roles[nextIndex];
                roleElement.classList.remove('slide-out');
                roleElement.classList.add('slide-in');
                
                // Update indices
                currentIndex = nextIndex;
                nextIndex = (nextIndex + 1) % roles.length;

                // After the slide-in animation ends, remove the class
                setTimeout(() => {
                    roleElement.classList.remove('slide-in');
                    // Add a short delay before adding slide-out again for the next transition
                    setTimeout(() => roleElement.classList.add('slide-out'), 2);
                }, 500); // Duration should match slide-in animation duration
            }, 500); // Duration should match slide-out animation duration
        }

        // Initialize role display without transition
        roleElement.textContent = roles[currentIndex];

        // Start the role change process
        setInterval(changeRole, 2000); // Change role every 2 seconds
    }
});
