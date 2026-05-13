-- Migration to expand hrm_employee_master with all requested fields
ALTER TABLE hrm_employee_master ADD
    -- Classification & Identity
    employee_photo_upload VARCHAR(MAX),
    employee_signature_upload VARCHAR(MAX),
    nda_upload VARCHAR(MAX),
    fitness_certificate_upload VARCHAR(MAX),
    
    -- Organization
    vertical_head VARCHAR(200),
    hr_manager VARCHAR(200),
    office_mail VARCHAR(200),
    office_mail_password VARCHAR(200),
    pf_toggle VARCHAR(10) DEFAULT 'NO',
    esi_toggle VARCHAR(10) DEFAULT 'NO',
    p_tax_toggle VARCHAR(10) DEFAULT 'NO',
    bonus_toggle VARCHAR(10) DEFAULT 'NO',
    ot_toggle VARCHAR(10) DEFAULT 'NO',
    ot_factorial DECIMAL(10,2),
    lom_deduction VARCHAR(10) DEFAULT 'NO',
    lom_allow VARCHAR(10) DEFAULT 'NO',
    lta_eligible VARCHAR(10) DEFAULT 'NO',
    pf_restriction VARCHAR(10) DEFAULT 'NO',
    permission_toggle VARCHAR(10) DEFAULT 'NO',
    permission_limit DECIMAL(10,2),
    vendor_name VARCHAR(200),
    
    -- Personal Details
    gender VARCHAR(50),
    marital_status VARCHAR(50),
    married_date DATE,
    dob DATE,
    personal_email VARCHAR(200),
    blood_group VARCHAR(50),
    region_id BIGINT,
    shirt_size VARCHAR(50),
    pant_size VARCHAR(50),
    shoe_size VARCHAR(50),
    height DECIMAL(10,2),
    weight DECIMAL(10,2),
    
    -- Address Details (Communication)
    comm_address VARCHAR(MAX),
    comm_city VARCHAR(200),
    comm_state VARCHAR(200),
    comm_country VARCHAR(200),
    comm_pincode VARCHAR(50),
    
    -- Permanent Address (already exists in some versions, ensuring consistency)
    perm_address VARCHAR(MAX),
    perm_city VARCHAR(200),
    perm_state VARCHAR(200),
    perm_country VARCHAR(200),
    perm_pincode VARCHAR(50),

    -- ID Details
    aadhar_no VARCHAR(50),
    driving_license_no VARCHAR(100),
    passport_no VARCHAR(100),
    place_of_issue VARCHAR(200),
    passport_expiry_date DATE,
    loan_installment_amount DECIMAL(18,2),
    
    -- Statutory
    pan_no VARCHAR(50),
    pf_no VARCHAR(50),
    uan_no VARCHAR(50),
    
    -- Bank Details
    account_no VARCHAR(100),
    account_name VARCHAR(200),
    branch_name VARCHAR(200),
    bank_account_type VARCHAR(50),
    bank_name VARCHAR(200),
    ifsc_code VARCHAR(50),
    
    -- Pay Component
    gross_salary DECIMAL(18,2),
    net_salary DECIMAL(18,2),
    basic_salary_comp DECIMAL(18,2),
    da_comp DECIMAL(18,2),
    hra_comp DECIMAL(18,2),
    special_allowance_comp DECIMAL(18,2),
    performance_incentive_comp DECIMAL(18,2),
    canteen_deduction DECIMAL(18,2),
    pf_type VARCHAR(50),
    pf_employee_comp DECIMAL(18,2),
    esi_employee_comp DECIMAL(18,2),
    professional_tax_comp DECIMAL(18,2),
    upload_pf_document VARCHAR(MAX),
    
    -- CTC Details
    monthly_ctc DECIMAL(18,2),
    basic_salary_ctc DECIMAL(18,2),
    da_ctc DECIMAL(18,2),
    special_allowance_ctc DECIMAL(18,2),
    canteen_allowance_ctc DECIMAL(18,2),
    performance_incentive_ctc DECIMAL(18,2),
    esi_ctc DECIMAL(18,2),
    pf_ctc DECIMAL(18,2),
    gross_ctc DECIMAL(18,2),
    employer_contribution_pf DECIMAL(18,2),
    employer_contribution_esi DECIMAL(18,2),
    uniform_allowance DECIMAL(18,2),
    shoe_allowance DECIMAL(18,2),
    mobile_allowance_cug DECIMAL(18,2),
    annual_ctc DECIMAL(18,2),
    salary_ctc DECIMAL(18,2),
    gratuity_ctc DECIMAL(18,2),
    bonus_ctc DECIMAL(18,2),
    special_incentive_ctc DECIMAL(18,2),
    performance_linked_incentive DECIMAL(18,2),
    health_insurance DECIMAL(18,2);
GO
