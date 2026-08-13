import {
  Anchor,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Code,
  Divider,
  Indicator,
  Kbd,
  PasswordInput,
  PinInput,
  Rating,
  Select,
  Slider,
  StatusBadge,
  Switch,
  Text,
  Textarea,
  TextInput,
} from "@stellaria/nebula-web";

const STATES = [
  { value: "mx", label: "Mexico" },
  { value: "es", label: "Spain" },
  { value: "co", label: "Colombia" },
];

export const ScenarioComponents = () => {
  return (
    <Box display="flex" direction="column" gap="md">
      <Box
        display="grid"
        gap="md"
        gridTemplateColumns={{
          base: "1fr",
          tablet: "repeat(2, minmax(0, 1fr))",
          laptop: "repeat(3, minmax(0, 1fr))",
        }}
      >
        <Card withBorder r="md" p="md">
          <Box display="flex" direction="column" gap="md">
            <TextInput label="Your email" placeholder="ana@email.com" required />
            <Select label="Country" placeholder="Select one" data={STATES} />
            <PasswordInput label="Password" placeholder="••••••••" />
          </Box>
        </Card>

        <Card withBorder r="md" p="md">
          <Box display="flex" direction="column" gap="md">
            <Text fz="body2" fw="semibold">
              Verify account
            </Text>
            <Text fz="caption" c="text.muted">
              We sent a code to a****@email.com
            </Text>
            <PinInput length={4} defaultValue="43" aria-label="Verification code" />
            <Box display="flex" gap="sm" align="center">
              <Text fz="caption" c="text.muted">
                Didn&apos;t get it?
              </Text>
              <Anchor href="#resend" fz="caption">
                Resend
              </Anchor>
            </Box>
          </Box>
        </Card>

        <Card withBorder r="md" p="md">
          <Box display="flex" direction="column" gap="md">
            <Box display="flex" gap="sm" align="center" wrap="wrap">
              <Button size="sm">Filled</Button>
              <Button size="sm" variant="outline">
                Outline
              </Button>
              <Button size="sm" variant="gradient">
                Gradient
              </Button>
              <Button size="sm" variant="glass">
                Glass
              </Button>
            </Box>
            <Divider />
            <Box display="flex" gap="md" align="center" wrap="wrap">
              <Checkbox defaultChecked label="Checkbox" />
              <Switch defaultChecked label="Switch" />
            </Box>
            <Rating defaultValue={4} aria-label="Rating" />
          </Box>
        </Card>

        <Card withBorder r="md" p="md">
          <Box display="flex" direction="column" gap="md">
            <Box display="flex" justify="space-between" align="baseline">
              <Text fz="body2" fw="semibold">
                Price
              </Text>
              <Text fz="body3" c="text.secondary">
                USD 250.00
              </Text>
            </Box>
            <Slider defaultValue={62} label="Price" />
            <Divider />
            <Box display="flex" gap="xs" align="center" wrap="wrap">
              <Text fz="caption" c="text.muted">
                Open the palette
              </Text>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </Box>
          </Box>
        </Card>

        <Card withBorder r="md" p="md">
          <Box display="flex" direction="column" gap="sm">
            <Box display="flex" align="center" gap="sm">
              <Indicator processing>
                <Avatar name="Ana Ruiz" color="primary" variant="light" />
              </Indicator>
              <Box display="flex" direction="column">
                <Text fz="body3" fw="semibold">
                  Ana Ruiz
                </Text>
                <Text fz="caption" c="text.muted">
                  Reconciliation lead
                </Text>
              </Box>
            </Box>
            <Divider />
            <Box display="flex" gap="xs" wrap="wrap">
              <StatusBadge status="matched" size="sm" />
              <Badge variant="light" size="sm" color="info">
                Verified
              </Badge>
              <Badge variant="outline" size="sm">
                Admin
              </Badge>
            </Box>
            <Code>@stellaria/nebula-web</Code>
          </Box>
        </Card>

        <Card withBorder r="md" p="md">
          <Box display="flex" direction="column" gap="md">
            <Textarea label="Notes" placeholder="What happened?" autosize rows={3} />
            <Box display="flex" gap="sm">
              <Button size="sm" variant="gradient">
                Save
              </Button>
              <Button size="sm" variant="ghost">
                Discard
              </Button>
            </Box>
          </Box>
        </Card>

        <Card withBorder r="md" p="md">
          <Box display="flex" direction="column" gap="md">
            <Text fz="body2" fw="semibold">
              Notifications
            </Text>
            <Box display="flex" gap="md" align="center" wrap="wrap">
              <Switch defaultChecked label="Email" />
              <Switch defaultChecked label="Push" />
              <Switch defaultChecked label="SMS" />
            </Box>
          </Box>
        </Card>

        <Card withBorder r="md" p="md">
          <Box display="flex" direction="column" gap="md">
            <Text fz="body2" fw="semibold">
              Account
            </Text>
            <Box display="flex" gap="md" align="center" wrap="wrap">
              <Button size="sm" variant="filled" color="primary">
                Change password
              </Button>
              <Button size="sm" variant="filled" color="red">
                Delete account
              </Button>
            </Box>
          </Box>
        </Card>
        <Card withBorder r="md" p="md">
          <Box display="flex" direction="column" gap="md">
            <Text fz="body2" fw="semibold">
              Profile
            </Text>
            <Box display="flex" gap="md" align="center" wrap="wrap">
              <Button size="sm" variant="filled">
                Edit profile
              </Button>
              <Button size="sm" variant="outline">
                Upload avatar
              </Button>
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};
