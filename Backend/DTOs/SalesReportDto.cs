namespace Backend.DTOs;

public class SalesReportDto
{
    public decimal TotalSales { get; set; }
    public int OrderCount { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}
