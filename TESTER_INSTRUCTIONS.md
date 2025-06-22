# TaskBoard App - Tester Instructions

## 🚀 Quick Start

### Login
1. **Quick Login (Recommended)**: Click any of the user buttons in the "Quick Login" section
   - **Nikhil Yadav** - username: `nikhilyadav`, password: `password1`
   - **Emitrr** - username: `emitrr`, password: `password`
   - **Priya Sharma** - username: `priyasharma`, password: `password2`
   - **Aman Gupta** - username: `amangupta`, password: `password3`

2. **Manual Login**: Enter username and password manually in the form below

## 🎯 Features to Test

### 1. **Task Management**
- **Create Tasks**: Click the "+" button in any column to add a new task
- **Edit Tasks**: Click on any task card to open the edit modal
- **Delete Tasks**: Use the delete button in the task modal
- **Move Tasks**: Drag and drop tasks between columns

### 2. **Task Details**
- **Title & Description**: Add/edit task titles and descriptions (supports Markdown)
- **Priority**: Set priority levels (Low, Medium, High)
- **Due Date**: Set and view due dates
- **Assignees**: Assign tasks to multiple team members
- **Creator**: See who created each task

### 3. **User Interface**
- **Theme Toggle**: Switch between light and dark themes using the theme icon
- **Responsive Design**: Test on different screen sizes
- **Real-time Updates**: Changes sync across multiple browser tabs/windows

### 4. **Board Features**
- **Multiple Boards**: Navigate between different project boards
- **Column Management**: Tasks are organized in columns (To Do, In Progress, Review, Done)
- **Task Filtering**: Filter tasks by assignee, priority, or due date

## 🔧 Testing Scenarios

### Basic Functionality
1. **Login with different users** and verify user-specific data
2. **Create a new task** with all fields filled
3. **Edit an existing task** and save changes
4. **Delete a task** and confirm it's removed
5. **Drag and drop** tasks between columns

### Advanced Features
1. **Assign multiple users** to a single task
2. **Set different priorities** and verify color coding
3. **Add due dates** and check date formatting
4. **Use Markdown** in task descriptions (bold, italic, lists)
5. **Switch themes** and verify all elements adapt

### Real-time Collaboration
1. **Open multiple browser tabs** with different users logged in
2. **Make changes in one tab** and verify they appear in other tabs
3. **Test concurrent editing** of the same task

### Edge Cases
1. **Try to create a task** without required fields
2. **Test with very long** task titles and descriptions
3. **Verify error handling** for network issues
4. **Test on mobile devices** for responsiveness

## 🐛 Bug Reporting

If you encounter any issues, please report them with:
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Browser and device** information
- **Screenshots** if applicable

## 📱 Browser Compatibility

Test the application on:
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎨 UI/UX Feedback

Please provide feedback on:
- **Ease of use** and intuitiveness
- **Visual design** and theme consistency
- **Performance** and responsiveness
- **Accessibility** features
- **Overall user experience**

---

**Note**: This is a demo application with in-memory storage. Data will be reset when the server restarts. 