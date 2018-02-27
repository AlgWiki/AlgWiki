# Pages

__Main Page__
- Overview of site
- Links to:
  - Wiki Home
  - Challenges
  - Tutorials

__Login__
- Modal dialog (not page)
- SSO or email/password
- Link to __Create User__ or __Forgot Password__

__Create User__
- Modal dialog
- SSO or email/password/validate (TODO: Is it possible to do this with an external service?)

__Profile__
- Displays your amount of *rep* (score/points)
- Lists all problems you've solved
- Lists all problems you have started but not finished
- Stats
  - Number of wins per challenge type
  - Preferred categories
- Edit profile settings
  - Avatar
  - Username (once every 90 days)
  - Password
  - Delete account

__Notifications__
- Dropdown with recent notifications
- Challenge submission beaten, invitation to chat room, etc.

__Chat Rooms__
- Public or private rooms to message any number of users (TODO: External service?)
- Notification when adding a user to a room


__Challenges__
- Lists challenges
  - Separated by current and finished challenges
  - Sorted by date started
- New challenge each day
- Challenges are open for a week
- Winning criteria for challenges are:
  - Fastest code (combined runtime for all standard tests)
  - Shortest code (code golf)
  - Most elegant
    - Voted after challenge finishes
    - Before voting, users need to choose a category or create a new category for the submission
      - Eg. for a *sum of all digits of a number* problem, there could be a *recursive* category and a
        *string iteration* category
    - Each category has a winner (if the top submission has a minimum number of votes)

__Challenge__
- Workspace with multiple panels for viewing or editing a submission
  - Problem description
  - Submission code
  - Submission explanation
  - Test cases
  - Other customisable tools
- Can be used by guests, but must be logged in to submit


__Wiki Home__
- Search
- List of categories
  - Expands to sub-categories, etc. up to individual problems
  - Categories and problems have __Wiki Page__s

__Wiki Page__
- Information regarding some aspect of computer science
- Editable by logged in users
  - Edits by new or flagged users are reviewed by high rep users/mods before being published
- Most pages will look like Wikipedia pages with some extra types of content:
  - Code examples
    - These embedded winning submissions of challenges
    - These can be edited, though edits to code require extra review
  - Links to tagged challenges


__Tutorials__
- Similar to __Wiki Home__ with search and category list but doesn't expand down to individual problems
- Selecting a category and a difficulty starts the __Learning Path__ for the category
- Incomplete __Learning Path__s and their progress are displayed at the top of the page

__Learning Path__
- Begins a series of challenges for the user
- Each challenge needs to be completed before moving on to the next one
- Hints can be provided from the wiki pages for the category/problem
- Multiple difficulties per category
- Progress within path is saved
