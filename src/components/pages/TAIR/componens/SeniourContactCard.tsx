type Props = {
  name: string;
  role: string;
  phone: string;
};

export default function SeniorContactCard({ name, role, phone }: Props) {
  return (
    <div className="profile-card">
      <div className="profile-img" style={{ lineHeight: "110px" }}>
        📞
      </div>
      <h3 className="profile-name">{name}</h3>
      <p className="profile-role">{role}</p>
      <p style={{ marginTop: "0.4rem", color: "#e5e7eb" }}>{phone}</p>
    </div>
  );
}
