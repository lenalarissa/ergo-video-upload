export default function getUser() {
    const userData = localStorage.getItem("result");
    console.log("getUser result from localStorage:", userData);
    try {
        const user = userData ? JSON.parse(userData).user : null;
        return user;
    } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        return null;
    }
}