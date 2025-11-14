export const getDate = (dateStr:Date) => {
     const date = new Date(dateStr);
     const day = date.getDate().toString().padStart(2, '0');
     const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
     const year = date.getFullYear();

     return `${day}/${month}/${year}`;
}

export function isAdult(dob: Date | string): boolean {
     const birthDate = new Date(dob)
     const today = new Date()

     const age = today.getFullYear() - birthDate.getFullYear()
     const hasHadBirthdayThisYear =
     today.getMonth() > birthDate.getMonth() ||
     (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate())

     return age > 18 || (age === 18 && hasHadBirthdayThisYear)
}

