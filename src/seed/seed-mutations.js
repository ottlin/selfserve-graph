export default `
  mutation  {
    e1: CreateEvent(
      name: "NAB Show",
      status: "STAGING",
      city: "Las Vegas",
      timezone: "Pacific Time Zone (UTC -7:00)",
      startDate: {formatted: "2020-02-20"},
      endDate: {formatted: "2020-03-20"},
      supportEmail: "mithun.hansh@openturf.in",
      banner: "https://picsum.photos/200/300"
    ) {
      id
      name
    }
  }
`
