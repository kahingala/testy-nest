import React, { useState, useEffect } from 'react';
import {
    IoMdAdd, IoMdPerson, IoMdMail, IoMdLock, IoMdCall, IoMdRestaurant
} from "react-icons/io";
import {
    FaUtensils, FaCookieBite, FaBirthdayCake, FaSignInAlt
} from "react-icons/fa";
import { GiCookingPot, GiChefToque } from "react-icons/gi";
import styles from './UserRegister.module.css';

function UserRegister() {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        phone: '',
        skills: [],
    });
    const [errors, setErrors] = useState({});

    // Validate field when value changes
    useEffect(() => {
        validateAllFields();
    }, [formData]);

    const validateAllFields = () => {
        const newErrors = {};
        const { fullname, email, password, phone, skills } = formData;

        if (!fullname.trim()) newErrors.fullname = "Full Name is required.";
        if (!email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Invalid email format.";
        }

        if (!password.trim()) {
            newErrors.password = "Password is required.";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        }

        if (!phone.trim()) {
            newErrors.phone = "Phone number is required.";
        } else if (!/^\d{10}$/.test(phone)) {
            newErrors.phone = "Phone must be exactly 10 digits.";
        }

        if (skills.length < 2) {
            newErrors.skills = "Please add at least two cooking skills.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateAllFields()) return;

        try {
            const response = await fetch('http://localhost:8080/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('User registered successfully!');
                setFormData({ fullname: '', email: '', password: '', phone: '', skills: [] });
                setErrors({});
                window.location.href = '/';
            } else if (response.status === 409) {
                setErrors({ email: 'Email already exists.' });
            } else {
                alert('Failed to register user.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className={styles.authContainer}>
            <GiCookingPot className={styles.floatingIcon} />
            <FaCookieBite className={styles.floatingIcon} />
            <FaBirthdayCake className={styles.floatingIcon} />

            <div className={styles.authInnerContainer}>
                <div className={styles.authHero}>
                    <div className={styles.authHeroImage}></div>
                </div>
                <div className={styles.authFormContainer}>
                    <div className={styles.authLogo}>
                        <h1 className={styles.authLogoText}>
                            <GiChefToque className={styles.authLogoIcon} />
                            TestyNest
                        </h1>
                    </div>
                    <div className={styles.authHeader}>
                        <h1 className={styles.authTitle}>
                            <IoMdRestaurant className={styles.authTitleIcon} />
                            Create your account!
                        </h1>
                        <p className={styles.authSubtitle}>Join our community of food enthusiasts</p>
                    </div>
                    <form onSubmit={handleSubmit} className={styles.authForm} noValidate>
                        {/* Full Name */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                <IoMdPerson className={styles.formLabelIcon} />
                                Full Name
                            </label>
                            <div style={{ position: 'relative' }}>
                                <IoMdPerson className={styles.inputIcon} />
                                <input
                                    className={styles.formInput}
                                    type="text"
                                    name="fullname"
                                    placeholder="Full Name"
                                    value={formData.fullname}
                                    onChange={handleInputChange}
                                />
                            </div>
                            {errors.fullname && <p className={styles.errorText}>{errors.fullname}</p>}
                        </div>

                        {/* Email */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                <IoMdMail className={styles.formLabelIcon} />
                                Email Address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <IoMdMail className={styles.inputIcon} />
                                <input
                                    className={styles.formInput}
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            {errors.email && <p className={styles.errorText}>{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                <IoMdLock className={styles.formLabelIcon} />
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <IoMdLock className={styles.inputIcon} />
                                <input
                                    className={styles.formInput}
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                            </div>
                            {errors.password && <p className={styles.errorText}>{errors.password}</p>}
                        </div>

                        {/* Phone */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                <IoMdCall className={styles.formLabelIcon} />
                                Phone
                            </label>
                            <div style={{ position: 'relative' }}>
                                <IoMdCall className={styles.inputIcon} />
                                <input
                                    className={styles.formInput}
                                    type="text"
                                    name="phone"
                                    placeholder="Phone"
                                    value={formData.phone}
                                    onChange={(e) => {
                                        const re = /^[0-9\b]{0,10}$/;
                                        if (re.test(e.target.value)) {
                                            handleInputChange(e);
                                        }
                                    }}
                                />
                            </div>
                            {errors.phone && <p className={styles.errorText}>{errors.phone}</p>}
                        </div>

                        {/* Skills - Updated to use dropdown */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                <FaUtensils className={styles.formLabelIcon} />
                                Cooking Skills
                            </label>
                            <div className={styles.skillsDisplay}>
                                {formData.skills.map((skill, index) => (
                                    <span className={styles.skillTag} key={index}>
                                        <IoMdRestaurant className={styles.skillTagIcon} />
                                        {skill}
                                        <span
                                            className={styles.deleteSkill}
                                            onClick={() => {
                                                const updatedSkills = formData.skills.filter((_, i) => i !== index);
                                                setFormData({ ...formData, skills: updatedSkills });
                                            }}
                                        >
                                            ✕
                                        </span>
                                    </span>
                                ))}
                            </div>
                            <div className={styles.skillInputWrapper}>
                                <div style={{ position: 'relative', flex: 1 }}>
                                    <FaUtensils className={styles.inputIcon} />
                                    <select
                                        className={styles.formInput}
                                        value=""
                                        onChange={(e) => {
                                            if (e.target.value && !formData.skills.includes(e.target.value)) {
                                                const updatedSkills = [...formData.skills, e.target.value];
                                                setFormData({ ...formData, skills: updatedSkills });
                                                e.target.value = ""; // Reset select to placeholder
                                            }
                                        }}
                                        style={{ paddingLeft: '2.5rem' }}
                                    >
                                        <option value="" disabled hidden>Select a skill</option>
                                        <option value="Baking">Baking</option>
                                        <option value="Grilling">Grilling</option>
                                        <option value="Boiling">Boiling</option>
                                        <option value="Sautéing">Sautéing</option>
                                        <option value="Roasting">Roasting</option>
                                    </select>
                                </div>
                            </div>
                            {errors.skills && <p className={styles.errorText}>{errors.skills}</p>}
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className={styles.submitButton}>
                            <FaSignInAlt className={styles.submitButtonIcon} />
                            Register Now
                        </button>

                        <p className={styles.authFooter}>
                            Already have an account?{' '}
                            <a href="/" className={styles.authLink}>
                                <FaSignInAlt className={styles.authLinkIcon} />
                                Sign in
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UserRegister;