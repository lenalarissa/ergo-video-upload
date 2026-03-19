export default function getUser() {
    const userData = localStorage.getItem("result");

    try {
        const user = userData ? JSON.parse(userData).user : null;
        return user;
    } catch (e) {
        console.error(encodeURIComponent);
        return null;
    }
}