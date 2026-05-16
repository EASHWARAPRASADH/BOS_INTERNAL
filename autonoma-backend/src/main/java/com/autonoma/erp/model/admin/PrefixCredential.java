package com.autonoma.erp.model.admin;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Entity
@Table(name = "ad_prefix_credentials")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrefixCredential {

    @Id
    @Column(name = "account_year", nullable = false, columnDefinition = "VARCHAR(20)")
    private String accountYear;

    @Column(name = "status")
    private Integer status;

    @Column(name = "sales_order_prefix", columnDefinition = "VARCHAR(20)")
    private String salesOrderPrefix;

    @Column(name = "mat_po_prefix", columnDefinition = "VARCHAR(20)")
    private String matPoPrefix;

    @Column(name = "gate_entry_prefix", columnDefinition = "VARCHAR(20)")
    private String gateEntryPrefix;

    @Column(name = "invoice_prefix", columnDefinition = "VARCHAR(20)")
    private String invoicePrefix;

    @Column(name = "created_by", columnDefinition = "NVARCHAR(100)")
    private String createdBy;

    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate;

    @Column(name = "updated_by", columnDefinition = "NVARCHAR(100)")
    private String updatedBy;

    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedDate;

    // Getters and Setters can be omitted if Lombok is working properly,
    // but adding them explicitly is safer for some build setups.
    public String getAccountYear() {
        return accountYear;
    }

    public void setAccountYear(String accountYear) {
        this.accountYear = accountYear;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getSalesOrderPrefix() {
        return salesOrderPrefix;
    }

    public void setSalesOrderPrefix(String salesOrderPrefix) {
        this.salesOrderPrefix = salesOrderPrefix;
    }

    public String getMatPoPrefix() {
        return matPoPrefix;
    }

    public void setMatPoPrefix(String matPoPrefix) {
        this.matPoPrefix = matPoPrefix;
    }

    public String getGateEntryPrefix() {
        return gateEntryPrefix;
    }

    public void setGateEntryPrefix(String gateEntryPrefix) {
        this.gateEntryPrefix = gateEntryPrefix;
    }

    public String getInvoicePrefix() {
        return invoicePrefix;
    }

    public void setInvoicePrefix(String invoicePrefix) {
        this.invoicePrefix = invoicePrefix;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(Date updatedDate) {
        this.updatedDate = updatedDate;
    }
}
