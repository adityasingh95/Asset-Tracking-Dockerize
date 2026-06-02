package com.nesa.interview.assettracking.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "assets")
@Data
@SQLDelete(sql = "UPDATE assets SET is_deleted = true WHERE id = ?")
@SQLRestriction("is_deleted = false")
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String type;

    private String status;

    @Column(name = "is_deleted")
    private boolean isDeleted = false;
}
