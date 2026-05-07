package com.autonoma.erp.controller;

import com.autonoma.erp.model.Designation;
import com.autonoma.erp.repository.DesignationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/master/hr/designation")
@CrossOrigin(origins = "*")
public class DesignationController {

    @Autowired
    private DesignationRepository designationRepository;

    @GetMapping
    public List<Designation> getAll() {
        return designationRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Designation> getById(@PathVariable Long id) {
        return designationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Designation create(@RequestBody Designation designation) {
        if (designation.getCreatedBy() == null) designation.setCreatedBy("Admin");
        return designationRepository.save(designation);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Designation> update(@PathVariable Long id, @RequestBody Designation designationDetails) {
        return designationRepository.findById(id)
                .map(designation -> {
                    designation.setDesignationName(designationDetails.getDesignationName());
                    designation.setSubCategoryLevel(designationDetails.getSubCategoryLevel());
                    designation.setExperience(designationDetails.getExperience());
                    designation.setAppearInCompetency(designationDetails.getAppearInCompetency());
                    designation.setDisplaySlNo(designationDetails.getDisplaySlNo());
                    designation.setQualification(designationDetails.getQualification());
                    designation.setJobDescription(designationDetails.getJobDescription());
                    designation.setOrgSeqNo(designationDetails.getOrgSeqNo());
                    designation.setBudgetedPositions(designationDetails.getBudgetedPositions());
                    designation.setUpdatedBy("Admin");
                    return ResponseEntity.ok(designationRepository.save(designation));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return designationRepository.findById(id)
                .map(designation -> {
                    designationRepository.delete(designation);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/next-code")
    public String getNextCode() {
        try {
            Integer maxCode = designationRepository.findMaxDesignationCode().orElse(0);
            String nextCode = String.valueOf(maxCode + 1);
            System.out.println("Generated Next Designation Code: " + nextCode);
            return nextCode;
        } catch (Exception e) {
            System.err.println("Error generating next designation code: " + e.getMessage());
            return "1";
        }
    }

    @GetMapping("/next-sl-no")
    public Integer getNextSlNo() {
        try {
            return designationRepository.findMaxDisplaySlNo().orElse(0) + 1;
        } catch (Exception e) {
            return 1;
        }
    }
}
