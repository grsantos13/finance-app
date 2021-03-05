export default class DateUtils {
  convertDate(date) {
    if (date === null) {
      return null;
    }
    return new Date(date).toLocaleDateString("pt-BR", { timeZone: "UTC" });
  }

  convertDateTime(date) {
    if (date === null) {
      return null;
    }
    return new Date(date).toLocaleString("pt-BR", { timeZone: "UTC" });
  }
}
