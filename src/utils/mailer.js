function generateNewPassword() {
    const newPassword = (Math.random() + 1).toString(36).substring(2).replace("j", "@").replace("y", "#").replace("a", "!")
    return newPassword;
}

export default generateNewPassword