package com.autonoma.erp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Entity
@Table(name = "ad_user_credential")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCredential {
    @Id
    @Column(name = "USER_ID", columnDefinition = "NVARCHAR(50)")
    private String userId;

    @Column(name = "EMP_ID", nullable = false)
    private Long empId;

    @Column(name = "PASSWORD", nullable = false, columnDefinition = "NVARCHAR(255)")
    private String password;

    @Column(name = "CREATED_BY", columnDefinition = "NVARCHAR(50)")
    private String createdBy;

    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "UPDATED_BY", columnDefinition = "NVARCHAR(50)")
    private String updatedBy;

    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    @Column(name = "STATUS")
    private Integer status;

    @Column(name = "IMG_NAME", columnDefinition = "NVARCHAR(255)")
    private String imgName;

    @Column(name = "is_bos_admin")
    private Integer isBosAdmin;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public Long getEmpId() { return empId; }
    public void setEmpId(Long empId) { this.empId = empId; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
    public Date getCreatedDate() { return createdAt; }
    public void setCreatedDate(Date createdDate) { this.createdAt = createdDate; }
    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }
    public Date getUpdatedDate() { return updatedAt; }
    public void setUpdatedDate(Date updatedDate) { this.updatedAt = updatedDate; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public String getImgName() { return imgName; }
    public void setImgName(String imgName) { this.imgName = imgName; }
    public Integer getIsBosAdmin() { return isBosAdmin; }
    public void setIsBosAdmin(Integer isBosAdmin) { this.isBosAdmin = isBosAdmin; }
}
