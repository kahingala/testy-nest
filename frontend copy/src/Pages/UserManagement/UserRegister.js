import React, { useState } from 'react';
import { IoMdAdd, IoMdPerson, IoMdMail, IoMdLock, IoMdCall, IoMdRestaurant } from "react-icons/io";
import { FaUtensils, FaCookieBite, FaBirthdayCake, FaSignInAlt } from "react-icons/fa";
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
    const [skillInput, setSkillInput] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddSkill = () => {
        if (skillInput.trim()) {
            setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
            setSkillInput('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let isValid = true;

        if (!formData.email) {
            alert("Email is required");
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            alert("Email is invalid");
            isValid = false;
        }

        if (formData.skills.length < 2) {
            alert("Please add at least two cooking skills.");
            isValid = false;
        }

        if (!isValid) return;

        try {
            const response = await fetch('http://localhost:8080/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                alert('User registered successfully!');
                setFormData({ fullname: '', email: '', password: '', phone: '', skills: [] });
                window.location.href = '/';
            } else if (response.status === 409) {
                alert('Email already exists!');
            } else {
                alert('Failed to register user.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className={styles.authContainer}>
            {/* Floating food icons */}
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
                    <form onSubmit={handleSubmit} className={styles.authForm}>
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
                                    required
                                />
                            </div>
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
                                    required
                                />
                            </div>
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
                                    required
                                />
                            </div>
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
                                    maxLength="10"
                                    pattern="[0-9]{10}"
                                    title="Please enter exactly 10 digits."
                                    required
                                />
                            </div>
                        </div>

                        {/* Skills */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                <FaUtensils className={styles.formLabelIcon} />
                                Cooking Skills
                            </label>

                            {/* Display added skills */}
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

                            {/* Skill Input + Add Button */}
                            <div className={styles.skillInputWrapper}>
                                <div style={{ position: 'relative', flex: 1 }}>
                                    <FaUtensils className={styles.inputIcon} />
                                    <input
                                        className={styles.formInput}
                                        type="text"
                                        placeholder="Add a cooking skill (e.g., Baking, Grilling)"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        style={{ paddingLeft: '2.5rem' }}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddSkill}
                                    className={styles.addSkillButtonReal}
                                >
                                    <IoMdAdd />
                                    Add Skill
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className={styles.submitButton}>
                            <FaSignInAlt className={styles.submitButtonIcon} />
                            Register Now
                        </button>

                        {/* Footer Link */}
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

export default UserRegister;