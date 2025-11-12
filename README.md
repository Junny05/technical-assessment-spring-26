# 💡 Impact Team Technical Assessment Spring 2026 💡
Congratulations on reaching the next step of the application process! This phase is the most important one in the entire process, as it assesses your ability to create a web app using both tools you're familiar with and ones you probably aren't and will have to pick up as you go. This is one of the most important skills for a web developer to cultivate.

By **Monday, December 1st, 2025 at 11:59pm**, you must fork this repository and submit a PR (pull request) to this repository with both your completed version of the app and a screen recording of you walking me through your app's features.

## Your Task
I feel like I've been a little bit too in my niche lately. A lot of the stuff I've been reading and learning about has been exclusively in fields I know a lot about. So I want to use this technical assessment as a chance for you to **teach me something new**.

To do this, I am hosting the **Hack4Impact Idea Expo**! Your technical assessment will be a submission to this (fictional) event; with this framing, you will create a website that can be easily and intuitively navigated through as if it was a part of a stand in an expo. It should summarize whatever you want to teach me on an interactive, aesthetically interesting home page, but have more threads of information, pages, etc. as you see fit for those who want to learn in more detail. It will also include some interactive pieces.

In particular, your app should include the following features:
- An interesting and beautiful frontend design with a catchy title and cool fonts and colors that looks good on any screen size.
- A home page with a summary about the interesting thing you want to teach me about. I was originally planning for this to be purely academic (e.g. math, CS, physics, engineering) topics but I am expanding it to include anything. However, you should be able to teach about whatever you choose in a clear way and go in-depth about it. If your subject matter is particularly engaging, that will reflect positively on your application.
- Extra pages with more detailed information on certain topics. Make your website intuitive to navigate through, both within the pages themselves and in your choice of pages. You can structure your website however you see fit.
- A poll/quiz feature where you can check that the user is aborbing the information your website teaches about well. These quiz questions should be scattered throughout the website, and they should tell the user whether they got the answer right or not once they select it. Additionally, it should show a live count of results (like a social media poll) with the names of the users who have voted for each option. You should take time to make sure your UI for this component is intuitive to use while still including all of the features listed. A user should be able to change their result if they want, and this should be reflected in the result count.
- A comment feature on each page where users can offer feedback or ask questions based on the lesson on the page. The home page does not need a comment section, but every other page should have one.
- Deploy the frontend and backend if you can using some of the free deployment tools we talked about in the workshops!

You should prompt the user for their name the first time they interact with something, but then store it locally. Quiz results and comments should be stored in an external database and saved. You do not need to add account/authentication features to your website; if the user refreshes the site, you can ask for their name again when they interact with something.

**If you don't finish everything on time, just submit what you have. Partial submissions will still be considered. Please try to give yourself adequate time to work on this project, though. Start it as early as you can!**

## Things to Consider
This task is tough and time-intensive! Try your best with it. I am really excited to see what you come up with. Please start working on it early, and budget your time well. I am going to be strict about the deadline.

I highly encourage you to take this opportunity to learn about and use web development tools that you are not familiar with. One of the most important skills as a web developer is to be able to understand and read documentation. Submissions that go beyond what we covered in JDT will be valued higher, but you must understand your code! You will be asked about it during your interview, if you reach that step.

I have a few pieces of advice for you:
- Don't skimp out on the frontend. I want your sites to look pretty, so really make an effort to give them a nice visual aesthetic. You are welcome to use a UI library such as [Material UI](https://mui.com/material-ui/all-components/).
- Don't forget to put any private information, such as API keys, in your .env file. Put the .env file in your .gitignore so it is not pushed onto GitHub.
- Feel free to use my technical assessment when I applied for Impact Team, [Our Republic](https://our-republic.vercel.app/), as a model and a guide for you. It has some of the features we didn't cover in the JDT workshops, such as multiple pages, so feel free to copy my main.jsx code from there when working to implement that. You can access the code for it [here](https://github.com/adam-godel/our-republic/).
- You may want to look over the [Glued Trees](https://gluedtrees.com/) website I made after I worked on a research project in summer 2024. This is kind of along the lines of what I'm thinking of, but your website should look better and have a lot more features than this one does.
  
Most importantly, try your best to just make something you're proud of! **If you're unable to implement every feature of the site, that's okay, just submit whatever you have.** Please really try to give yourself the time you need to work on it, though.

## A Note on LLMs
You are welcome to use LLMs to help you with anything you need for this project. However, please make sure you understand any code produced by a LLM that you use, since I may be asking you about your code during the interview, if you are invited to it.

## Good Luck!
I'm really excited to see what you produce! Try your best with it and don't worry if you can't figure out everything. Submit whatever you have as a PR following the template in [pr_template.md](pr_template.md). I hope you enjoy working on this and feel proud enough of it to use it as a project or a demo of your abilities on your portfolio :)
